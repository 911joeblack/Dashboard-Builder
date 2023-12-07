const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config(); 

const pool = require('./db.js');
const jwt = require('jsonwebtoken');

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

