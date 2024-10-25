// src/App.tsx
import React, { useState } from 'react';
import Map from './components/Map';
import RestaurantCrowd from './components/RestaurantCrowd';
import SearchBar from './components/SearchBar';
import CrowdHistory from './components/CrowdHistory';
import { getPlaceDetails, searchPlaceByQuery } from './services/googlePlacesService';
import { saveDataToFirebase } from './services/firebaseService';



function App() {
  const [placeId, setPlaceId] = useState(''); // Example placeId
  const [placeName, setPlaceName] = useState<string | null>(null);


  const handleSearch = async (query: string) => {
    // Implement search logic to get placeId using Google Places API
  try {
    const { name, place_id } = await searchPlaceByQuery(query);
    console.log('Found placeId:', place_id); // Debug
    setPlaceId(place_id);
    setPlaceName(name);
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
};

  const fetchAndStoreCrowdData = async (id: string) => {
    if (!id) return;

    const data = await getPlaceDetails(id);
    const time = new Date().toISOString();
    saveDataToFirebase(id, { time, crowdLevel: data.crowdLevel });
  };

  // Fetch and store data periodically for the selected place
  React.useEffect(() => {
    if (placeId) {
      const interval = setInterval(() => {
        fetchAndStoreCrowdData(placeId);
      }, 15 * 60 * 1000); // Fetch every 15 minutes

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [placeId]);


  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Map />
      {placeId && (
        <>
          <RestaurantCrowd placeId={placeId} />
          <CrowdHistory placeId={placeId} />
        </>
      )}
    </div>
  );
}

export default App;