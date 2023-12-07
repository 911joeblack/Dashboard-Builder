import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from '../resources/widget';
import './DashboardPage.css'; // Make sure to create this CSS file

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: 'totalCustomers', type: 'text', content: 'Total Customers', x: 0, y: 0, w: 2, h: 2 },
    { id: 'countOfOrders', type: 'text', content: 'Count of Orders', x: 2, y: 0, w: 2, h: 2 },
    { id: 'ltv', type: 'text', content: 'Lifetime Value (LTV)', x: 4, y: 0, w: 2, h: 2 }
  ]);

  const onLayoutChange = (newLayout) => {
    if(!isAnyModalOpen){  
      const updatedWidgets = newLayout.map(layoutItem => {
        const matchedWidget = widgets.find(w => w.id === layoutItem.i);
        return { ...matchedWidget, ...layoutItem };
      });
      setWidgets(updatedWidgets);
    }
  };

  const addNewWidget = () => {
    const newWidget = {
      id: `widget${widgets.length + 1}`, // Unique ID for the new widget
      type: 'text',
      content: 'New Widget',
      x: 0, // Adjust these values as needed
      y: Infinity, // Puts the widget at the bottom of the layout
      w: 2,
      h: 2
    };
    setWidgets([...widgets, newWidget]);
  };

  
  const deleteWidget = (widgetId, e) => {
      setWidgets(widgets.filter(widget => widget.id !== widgetId));
  }

  const handleEditWidget = (widgetId, chartType, isModalOpen) => {
    // Logic to update the widget's chart configuration
    setIsAnyModalOpen(isModalOpen); // Update the modal open state
    
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, chartType }; // Update with the new chart type
      }
      return widget;
    });

    setWidgets(updatedWidgets);
  };

  const handleSave = () => {
    // Example: Gather dashboard state
    const dashboardState = {
        //widgets: /* Array of widget states */
        // ... other relevant dashboard data ...
    };

    // Send this data to the backend via an API call
    // Example: axios.post('/api/dashboard/save', dashboardState)
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <div className="layout">
      <div className="dashboard-controls">
        <button className="dashboard-button" onClick={handleSave}>Save Dashboard</button>
        <button className="dashboard-button" onClick={handleLogout}>Log Out</button>
      </div>
      <button className="add-widget-button" onClick={addNewWidget}>Add Widget</button>
        <GridLayout className="layout" 
          key={widgets.length}
          layout={widgets.map(({ id, x, y, w, h }) => ({ i: id, x, y, w, h }))} 
          cols={12} rowHeight={30} width={1200} 
          onLayoutChange={onLayoutChange}
          isDraggable={!isAnyModalOpen}
        >
          {widgets.map(widget => (
            <div key={widget.id}>
              <Widget
                widget={widget}
                onDelete={deleteWidget}
                onEdit={(widgetId, chartType) => handleEditWidget(widgetId, chartType, true)}
                onModalStateChange={(isOpen) => setIsAnyModalOpen(isOpen)}
              />
            </div>
          ))}
        </GridLayout>
    </div>
  );
};

export default DashboardPage;
