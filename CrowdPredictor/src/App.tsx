// src/App.tsx
import './App.css';
import React, { useState } from 'react';
import Map from './components/Map';
import RestaurantCrowd from './components/RestaurantCrowd';
import SearchBar from './components/SearchBar';
import CrowdHistory from './components/CrowdHistory';
import { getPlaceDetails, searchPlaceByQuery } from './services/googlePlacesService';
import { saveDataToFirebase } from './services/firebaseService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function App() {
  const navigate = useNavigate(); // Initialize useNavigate
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
    <div className="app-container">
      <h1 className="app-title">CrowdPredictor</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="button-container">
        <button className="back-button" onClick={() => navigate('/')}>
          Back
        </button>
        <button className="settings-button" onClick={() => navigate('/settings')}>
          Settings
        </button>
      </div>
      <div className="map-container">
        <Map />
      </div>
      {placeId && (
        <>
          <div className="restaurant-crowd">
            <RestaurantCrowd placeId={placeId} />
          </div>
          <div className="crowd-history">
            <CrowdHistory placeId={placeId} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
