import React, { useState } from 'react';
import Modal from 'react-modal';
import './chartConfigModal.css';

Modal.setAppElement('#root'); // Replace '#root' with the id of your app's root element

const ChartConfigModal = ({ isOpen, onRequestClose, onSave }) => {
  const [selectedChartType, setSelectedChartType] = useState('bar'); // Example state

  const handleSave = () => {
    onSave(selectedChartType);
    onRequestClose(); // Close modal after saving
  };

  const handleModalClick = (e) => {
    console.log("Modal clicked", e); // Log the synthetic event
    console.log("Native event", e.nativeEvent); // Log the native event
    e.stopPropagation(); // Prevent clicks from propagating to underlying elements
  };

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
        {/* Add more chart types as needed */}
      </select>
      <button onClick={handleSave}>Save</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default ChartConfigModal;
