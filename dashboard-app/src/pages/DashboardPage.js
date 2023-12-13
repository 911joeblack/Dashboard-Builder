import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from '../resources/widget';
import './DashboardPage.css'; 
import { jwtDecode } from 'jwt-decode';


const DashboardPage = () => {
  const navigate = useNavigate();
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      console.log("Loading dashboard...");
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          // If using jwtDecode, make sure the import matches your package version
          const decoded = jwtDecode(token);
          const userId = decoded.userId; // Adjust based on your token structure
          const response = await fetch(`http://localhost:3001/api/dashboard/load?userId=${userId}`);

          if (response.ok) {
            const loadedWidgets = await response.json();
            console.log("Loaded Widgets:", loadedWidgets);
            const transformedWidgets = loadedWidgets.map(w => ({
              id: w.widget_id.toString(), // Convert ID to string if necessary
              type: w.type,
              data: w.data,
              filename: w.filename,
              x: w.position_x,
              y: w.position_y,
              w: w.width,
              h: w.height
            }));
            setWidgets(transformedWidgets)
          } else {
            console.error("Failed to load dashboard.");
          }
        } catch (error) {
          console.error("Error loading dashboard:", error);
        }
      } else {
        // Redirect to login or handle the absence of a token
        console.log("No token found. User must log in.");
      }
    };
    loadDashboard();
  }, []); // Dependency array is empty to run only on component mount
  
  const handleSave = async () => {
    const token = localStorage.getItem('userToken');
    const decoded = jwtDecode(token);
    const dashboardState = {
      userId: decoded.userId,
      widgets: widgets.map(w => ({
        type: w.type,
        data: JSON.stringify(w.data),
        filename: w.filename,
        position_x: w.x,
        position_y: w.y,
        width: w.w,
        height: w.h,
      })),
    };
    
    try {
      const response = await fetch('http://localhost:3001/api/dashboard/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dashboardState)
      });
  
      if (response.ok) {
        console.log("Dashboard saved successfully.");
      } else {
        console.error("Failed to save dashboard.");
      }
    } catch (error) {
      console.error("Error saving dashboard:", error);
    }
  };

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

  const handleEditWidget = (widgetId, chartType, filename, isModalOpen) => {
    // Logic to update the widget's chart configuration
    setIsAnyModalOpen(isModalOpen); // Update the modal open state
    
    const updatedWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, chartType, data: filename }; // Update with the new chart type
      }
      return widget;
    });

    setWidgets(updatedWidgets);
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
          layout={widgets.map(({ id, x, y, w, h }) => ({
            i: id,
            x,
            y,
            w,
            h
          }))}
      
          cols={12} rowHeight={30} width={1200} 
          onLayoutChange={onLayoutChange}
          isDraggable={!isAnyModalOpen}
        >
          {widgets.map((widget) => (
            <div key={widget.id}>
              <Widget
                widget={widget}
                onDelete={deleteWidget}
                onEdit={(widgetId, chartType) => handleEditWidget(widgetId, chartType, true)}
                onModalStateChange={(isOpen) => setIsAnyModalOpen(isOpen)}
                onLayoutChange={onLayoutChange}
              />
            </div>
          ))}
        </GridLayout>
    </div>
  );
};

export default DashboardPage;
