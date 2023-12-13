import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartComponent = ({ filename, chartType }) => {
  // Initialize chartData with a structure that includes an empty datasets array
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for:", filename);
        const response = await fetch(`http://localhost:3001/api/data/${filename}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && Array.isArray(data)) {
          console.log("Chart data: ", data);
          const processedData = processChartData(data, chartType);
          setChartData(processedData);
        } else {
          console.error("Error with chart data or data format is not as expected");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (filename) {
      console.log("Filename provided, fetching data...");
      fetchData();
    } else {
      console.log("No filename provided, chart will not be rendered");
    }
  }, [filename, chartType]);

  const processChartData = (rawData, chartType) => {
    // Assuming rawData is an array of objects with 'Category' and 'Value' fields
    const labels = rawData.map(item => item.Category.trim());
    const values = rawData.map(item => parseFloat(item.Value));

    // Setting different background colors for pie chart
    const backgroundColors = chartType === 'pie' 
        ? ['red', 'blue', 'green', 'yellow'] // Example colors for pie chart
        : 'blue'; // Single color for bar chart

    return {
        labels: labels,
        datasets: [{
          label: chartType === 'pie' ? 'Distribution' : 'Values',
          data: values,
          backgroundColor: backgroundColors,
        }]
    };
  };

  return (
    <>
      {chartType === 'bar' && <Bar data={chartData} />}
      {chartType === 'pie' && <Pie data={chartData} />}
    </>
  );
};

export default ChartComponent;