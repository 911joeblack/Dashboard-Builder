import React, { useState, useRef} from 'react';
import { useOnClickOutside } from './useOnClickOutside';
import './widget.css'; // Make sure to create this CSS file
import ChartConfigModal from './chartConfigModal';

const Widget = ({ widget, onDelete, onEdit, onModalStateChange  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const menuRef = useRef();

  useOnClickOutside(menuRef, () => {
    if (menuOpen) setMenuOpen(false);
  });

  const handleEdit = () => {
    setIsModalOpen(true);
    onModalStateChange(true);
  };

  const handleSaveModal = (chartType) => {
    // Logic to handle saving the chart configuration
    onEdit(widget.id, chartType);
    setIsModalOpen(false); // Ensure this fully disengages the edit mode
    onModalStateChange(false);
  };

  return(
    <div className="widget">
      {/* Kebab Menu Icon */}
      <div className="widget-menu" onMouseDown={() => setMenuOpen(prevState => !prevState)}>
        <i className="fas fa-ellipsis-v"></i> {/* This is a FontAwesome icon example */}
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

      <ChartConfigModal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          onModalStateChange(false); 
        }}        
        onSave={handleSaveModal}
      />
    </div>
  )
};
//        onRequestClose={() => setIsModalOpen(false)}

export default Widget;
