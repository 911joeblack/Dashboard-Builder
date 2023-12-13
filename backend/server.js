const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
require('dotenv').config(); 
const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const pool = require('./db.js');
const jwt = require('jsonwebtoken');
const { log } = require('console');

app.use(cors());
app.use(express.json()); 

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    console.log("Signup Request Body:", req.body); // Server-side logging
    const { username, password, email } = req.body;
    const query = 'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)';
    const [result] = await pool.execute(query, [username, password, email]);

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    console.log("Login Request Body:", req.body);
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    const [users] = await pool.execute(query, [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.password === password) {
      console.log("Password match");
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("Generated Token:", token); // Make sure this line logs a valid token
      res.json({ message: 'Login successful', token: token, userId: user.id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/api/dashboard/load', async (req, res) => {
  try {
    console.log("Load Request Query:", req.query); // Server-side logging    
    const userId = req.query.userId; // Or get from session/token

      // Ideally, you should validate the userId here

    const query = 'SELECT * FROM widgets WHERE user_id = ?';
    const [widgets] = await pool.execute(query, [userId]);
    //console.log("Widgets:", widgets);
    res.status(200).json(widgets);
  } 
  catch (error) {
    console.error('Error loading dashboard configuration:', error);
    res.status(500).json({ message: 'Error loading dashboard configuration' });
  }
});

app.post('/api/dashboard/save', async (req, res) => {
  try {
      const { userId, widgets } = req.body;

      // Ideally, you should validate the userId and widgets here

      // Delete existing widgets for the user to replace with new state
      const deleteQuery = 'DELETE FROM widgets WHERE user_id = ?';
      await pool.execute(deleteQuery, [userId]);

      // Insert new widget states
      const insertQuery = 'INSERT INTO widgets (user_id, type, data, position_x, position_y, width, height) VALUES ?';
      const values = widgets.map(w => [userId, w.type, JSON.stringify(w.data), w.position_x, w.position_y, w.width, w.height, w.filename]);
      console.log("Values:", values);
      if (values.length > 0) {
        await pool.query(insertQuery, [values]); 
      }

      res.status(200).json({ message: 'Dashboard configuration saved successfully' });
  } catch (error) {
      console.error('Error saving dashboard configuration:', error);
      res.status(500).json({ message: 'Error saving dashboard configuration' });
  }
});

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage: storage })

async function updateWidgetFilename(x, y, filename) {
  try {
    console.log("Updating widget filename:", x, y, filename);
    const query = 'UPDATE widgets SET filename = ? WHERE position_x = ? AND position_y = ?';
    await pool.execute(query, [filename, x, y]);
    await pool.execute(query, [filename, widgetId]);
  } catch (error) {
    console.error("Error updating widget filename:", error);
  }
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // File information is available in req.file
    console.log(req.file);
    const filename = req.file.filename;
    const x = req.body.x;
    const y = req.body.y;

    //res.status(200).send("File uploaded successfully");
    await updateWidgetFilename(x, y, filename);
    res.json({ filename: req.file.filename });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});

const parseCSV = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
};

app.get('/api/data/:filename', async (req, res) => {
  console.log("api/data/:filename");
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    console.log("Parsing file:", filePath);
    const parsedData = await parseCSV(filePath);
    console.log("Parsing Complete");
    console.log("Parsed data:", parsedData); 
    res.json(parsedData);
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file' });
  }
});

app.get('/api/test', (req, res) => {
  res.send('Server is running');
});

// Dashboard Data Routes
app.get('/api/dashboard', (req, res) => {
  // Retrieve dashboard data
});

app.post('/api/dashboard', (req, res) => {
  // Post new dashboard data
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

