import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './chartConfigModal.css';
import ChartComponent from './chartComponent';

Modal.setAppElement('#root');

const ChartConfigModal = ({ isOpen, onRequestClose, onSave, positionX, positionY }) => {
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Example state
  const [uploadedFile, setUploadedFile] = useState(null); // State to store the uploaded file
  
  const handleSave = () => {
    onSave(selectedChartType, uploadedFile);
    onRequestClose(); // Close modal after saving
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent clicks from propagating to underlying elements
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('positionX', positionX);
      formData.append('positionY', positionY);
      console.log("Uploading at position X:", positionX, "position Y:", positionY);
      try {
        const response = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log("File uploaded successfully.");
          console.log("Result:", result.filename);
          setUploadedFile(result.filename); // Store the new filename
        } else {
          console.error("Failed to upload file.");        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Uploaded File Effect:", uploadedFile);
  }, [uploadedFile]);
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Chart Configuration Modal"
      onMouseDown={handleModalClick} 
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <h2>Configure your Chart</h2>
      <select value={selectedChartType} onChange={e => setSelectedChartType(e.target.value)}>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>

      </select>
      <label htmlFor="datasetUpload">Upload Dataset:</label>
      <input 
        type="file" 
        id="datasetUpload" 
        name="dataset" 
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileUpload}
      />
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>

      {uploadedFile && <ChartComponent filename={uploadedFile} chartType={selectedChartType} />}
    </Modal>
  );
};

export default ChartConfigModal;
