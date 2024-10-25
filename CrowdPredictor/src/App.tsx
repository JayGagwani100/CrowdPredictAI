// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import RestaurantCrowd from './components/RestaurantCrowd';
import SearchBar from './components/SearchBar';
import CrowdHistory from './components/CrowdHistory';
import { getPlaceDetails, textSearch } from './services/googlePlacesService';
import { saveDataToFirebase } from './services/firebaseService';

function App() {
  const [placeId, setPlaceId] = useState('');
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<google.maps.places.PlaceResult | null>(null);

  const handleSearch = async (query: string) => {
    try {
      const places = await textSearch(query);
      if (places.length > 0) {
        const { name, place_id } = places[0];
        console.log('Found placeId:', place_id);
        if (place_id) {
          setPlaceId(place_id);
          setPlaceName(name ?? null);
        } else {
          console.error('Place ID is undefined');
        }
        setSearchResult(places[0]);
      } else {
        console.error('No places found for the query');
      }
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

  React.useEffect(() => {
    if (placeId) {
      const interval = setInterval(() => {
        fetchAndStoreCrowdData(placeId);
      }, 15 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [placeId]);

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} />
      <div className="map-container">
        <Map searchResult={searchResult} />
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