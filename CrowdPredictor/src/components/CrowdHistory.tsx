// src/components/CrowdHistory.tsx
import React, { useEffect, useState } from 'react';
import { getPopularTimes } from '../services/googlePlacesService';


const CrowdHistory = ({ placeId }: { placeId: string }) => {
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPopularTimes(placeId);
      setHistoryData(data);
    };
    fetchData();
  }, [placeId]);

  if (!historyData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Historical Crowd Data</h2>
      {/* Display historical data */}
    </div>
  );
};

export default CrowdHistory;