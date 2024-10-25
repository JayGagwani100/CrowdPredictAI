// src/components/RestaurantCrowd.tsx
import React, { useEffect, useState } from 'react';
import { getPlaceDetails } from '../services/googlePlacesService';

interface CrowdData {
  name: string;
  crowdLevel: number;
}

const RestaurantCrowd = ({ placeId }: { placeId: string }) => {
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlaceDetails(placeId);
      setCrowdData(data);
    };
    fetchData();
  }, [placeId]);

  if (!crowdData) return <div>Loading...</div>;

  return (
    <div>
      <h2>{crowdData.name}</h2>
      <p>Current Crowd Level: {crowdData.crowdLevel}</p>
    </div>
  );
};

export default RestaurantCrowd;