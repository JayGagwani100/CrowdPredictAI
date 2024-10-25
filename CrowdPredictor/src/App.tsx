// src/App.tsx
import React, { useState } from 'react';
import Map from './components/Map';
import RestaurantCrowd from './components/RestaurantCrowd';
import SearchBar from './components/SearchBar';
import CrowdHistory from './components/CrowdHistory';


function App() {
  const [placeId, setPlaceId] = useState(''); // Example placeId

  const handleSearch = (query: string) => {
    // Implement search logic to get placeId
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Map />
      <RestaurantCrowd placeId={placeId} />
      <CrowdHistory placeId={placeId} />
    </div>
  );
}

export default App;