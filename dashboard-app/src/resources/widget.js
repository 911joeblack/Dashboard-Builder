import React, { useState, useRef, useEffect } from 'react';
import { useOnClickOutside } from './useOnClickOutside';
import './widget.css'; // Make sure to create this CSS file
import ChartConfigModal from './chartConfigModal';
import ChartComponent from './chartComponent';

const Widget = ({ widget, onDelete, onEdit, onModalStateChange, onLayoutChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const [currentChartType, setCurrentChartType] = useState(widget.chartType);
  const [currentFilename, setCurrentFilename] = useState(widget.data);
  const [resizeKey, setResizeKey] = useState(0);
  const menuRef = useRef();

  useEffect(() => {
    console.log("Rerendering Widget");
    setResizeKey(prevKey => prevKey + 1);
  }, [onLayoutChange]);

  useOnClickOutside(menuRef, () => {
    if (menuOpen) setMenuOpen(false);
  });

  const handleEdit = () => {
    setIsModalOpen(true);
    onModalStateChange(true);

    setCurrentChartType(widget.chartType);
    setCurrentFilename(widget.data);
  };

  const handleSaveModal = (chartType, filename) => {
    console.log("Saving chart type:", chartType, "filename:", filename);
    onEdit(widget.id, chartType, filename);
    setIsModalOpen(false);
    onModalStateChange(false);

    setCurrentChartType(chartType);
    setCurrentFilename(filename);
  };
  
  useEffect(() => {
    console.log(`Current Chart Type: ${currentChartType}, Current Filename: ${currentFilename}`);
  }, [currentChartType, currentFilename]);

  return(
    <div className="widget">
      {/* Kebab Menu Icon */}
      <div className="widget-header">
        <div className="widget-controls">
          <div className="widget-menu" onMouseDown={() => setMenuOpen(prevState => !prevState)}>
            <i className="fas fa-ellipsis-v"></i> {/* This is a FontAwesome icon example */}
          </div>
        </div>
      </div>

      {/* Delete Icon */}
      <div className="widget-delete" onMouseDown={() => onDelete(widget.id)}>
        <i className="fas fa-times"></i> {/* This is a FontAwesome icon example */}
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="widget-dropdown" ref={menuRef}>
          <ul>
          <li onMouseDown={handleEdit}>Edit</li>
            {/* ... other actions ... */}
          </ul>
        </div>
      )}
      
      {/* Chart */}
      {widget.data && widget.chartType && (
        <ChartComponent 
          className="chart-container" 
          key={resizeKey} 
          filename={currentFilename} 
          chartType={currentChartType} 
        />
        )}

      <ChartConfigModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          onModalStateChange(false); 
        }}        
        onSave={handleSaveModal}
        currentChartType={currentChartType}
        currentFilename={currentFilename}
        positionX={widget.x}
        positionY={widget.y}
      />
    </div>
  )
};

export default Widget;
