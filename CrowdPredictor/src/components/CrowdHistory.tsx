// src/components/CrowdHistory.tsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js
import './CrowdHistory.css'; // Import CSS for styling

const CrowdHistory = ({ placeId }: { placeId: string }) => {
  const [busynessData, setBusynessData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    const fetchBusynessData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/busyness?placeId=${placeId}`);
        const data = await response.json();
        setBusynessData(data.busynessLevels);
        setLabels(data.labels);
        setShowPopup(true); // Show the popup when data is fetched
      } catch (error) {
        console.error('Error fetching busyness data:', error);
      }
    };
    fetchBusynessData();
  }, [placeId]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Busyness Level',
        data: busynessData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Historical Crowd Data</h2>
      {showPopup && busynessData.length > 0 && (
        <div className="popup">
          <Bar data={data} />
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default CrowdHistory;