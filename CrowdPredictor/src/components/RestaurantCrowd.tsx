// src/components/RestaurantCrowd.tsx
import React, { useEffect, useState } from 'react';
import { createModel, trainModelWithData, predictNextHourCrowd } from '../services/tensorflowModel';
import { getPlaceDetails } from '../services/googlePlacesService';
import { saveDataToFirebase } from '../services/firebaseService';

interface CrowdData {
  name: string;
  crowdLevel: number;
}

const RestaurantCrowd = ({ placeId }: { placeId: string }) => {
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);
  const [predictedLevel, setPredictedLevel] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real-time crowd data and store in Firebase
  const fetchData = async () => {
    try {
      const data = await getPlaceDetails(placeId);
      setCrowdData(data);

      const time = new Date().toISOString();
      saveDataToFirebase(placeId, { time, crowdLevel: data.crowdLevel });

      // TensorFlow model: create, train, and predict next hour crowd level
      const model = createModel();
      await trainModelWithData(model, placeId);

      const nextHour = new Date().getHours() + 1;
      const prediction = predictNextHourCrowd(model, nextHour);
      setPredictedLevel(prediction);
    } catch (error) {
      console.error('Error fetching or predicting data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (placeId) {
      fetchData();
    }
  }, [placeId]);

  if (loading) return <div>Loading...</div>;
  if (!crowdData) return <div>No data available for this place.</div>;

  return (
    <div>
      <h2>{crowdData.name}</h2>
      <p>Current Crowd Level: {crowdData.crowdLevel}%</p>
      {predictedLevel !== null && (
        <p>Predicted Crowd Level (Next Hour): {predictedLevel}%</p>
      )}
    </div>
  );
};

export default RestaurantCrowd;



/*

// src/components/RestaurantCrowd.tsx
import React, { useEffect, useState } from 'react';
import { getPlaceDetails } from '../services/googlePlacesService';
import { createModel, trainModelWithData, predictNextHourCrowd } from '../services/tensorflowModel.ts';
import { saveDataToFirebase } from '../services/firebaseService';


interface CrowdData {
  name: string;
  crowdLevel: number;
}

const RestaurantCrowd = ({ placeId }: { placeId: string }) => {
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);
  const [predictedLevel, setPredictedLevel] = useState<number | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      if(placeId){
      const data = await getPlaceDetails(placeId);
      setCrowdData(data);
      
      const time = new Date().toISOString();
      saveDataToFirebase(placeId, { time, crowdLevel: data.crowdLevel });

      const model = createModel();
      await trainModelWithData(model, placeId);

      const nextHour = new Date().getHours() + 1;
      const prediction = predictNextHourCrowd(model, nextHour);
      setPredictedLevel(prediction);


      }
    };
    fetchData();
  }, [placeId]);

  if (!crowdData) return <div>Loading...</div>;


  
  return (
    <div>
      <h2>{crowdData.name}</h2>
      <p>Current Crowd Level: {crowdData.crowdLevel}</p>
      {predictedLevel !== null && <p>Predicted Crowd Level (Next Hour): {predictedLevel}%</p>}

    </div>
  );
};

export default RestaurantCrowd;

*/