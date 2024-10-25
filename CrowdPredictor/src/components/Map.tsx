import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

// Initial center of the map (Toronto as an example)
const center = {
  lat: 43.65107,
  lng: -79.347015,
};

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo', // Replace with your API key
    libraries: ['places'], // Load Places library
  });

  const [restaurants, setRestaurants] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<google.maps.places.PlaceResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null); // Store a reference to the map

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    fetchRestaurants(map); // Fetch restaurants when the map loads
  }, []);

  const fetchRestaurants = (map: google.maps.Map) => {
    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: center,
      radius: 5000, // Search within 5 km radius
      type: 'restaurant', // Filter by type 'restaurant'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setRestaurants(results); // Store restaurant results in state
      } else {
        console.error('Error fetching restaurants:', status);
      }
    });
  };

  const onMapClick = useCallback(() => {
    setSelectedRestaurant(null); // Close InfoWindow when map is clicked
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      onLoad={onMapLoad}
      onClick={onMapClick}
    >
      {/* Render restaurant markers */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.place_id}
          position={{
            lat: restaurant.geometry?.location?.lat() ?? 0,
            lng: restaurant.geometry?.location?.lng() ?? 0,
          }}
          onClick={() => setSelectedRestaurant(restaurant)}
        />
      ))}

      {/* Show InfoWindow for selected restaurant */}
      {selectedRestaurant && (
        <InfoWindow
          position={{
            lat: selectedRestaurant.geometry?.location?.lat() ?? 0,
            lng: selectedRestaurant.geometry?.location?.lng() ?? 0,
          }}
          onCloseClick={() => setSelectedRestaurant(null)}
        >
          <div style={infoWindowStyle}>
            <h2>{selectedRestaurant.name || 'Unnamed Restaurant'}</h2>
            <p>{selectedRestaurant.vicinity || 'Address not available'}</p>
            {selectedRestaurant.rating && (
              <p>Rating: {selectedRestaurant.rating} ⭐</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

// Styling for the InfoWindow content
const infoWindowStyle: React.CSSProperties = {
  color: '#000', // Black text for visibility
  backgroundColor: '#fff', // White background
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
};

export default Map;






/*

import React, { useCallback, useState } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 43.65107, // Example lat
  lng: -79.347015, // Example lng
};

// Dummy restaurant data
const restaurants = [
  {
    id: 1,
    name: 'Pizza Palace',
    position: { lat: 43.6532, lng: -79.3832 },
    description: 'Best pizza in the city!',
  },
  {
    id: 2,
    name: 'Sushi World',
    position: { lat: 43.6453, lng: -79.3806 },
    description: 'Fresh sushi and more.',
  },
];

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo', // Replace with your actual API key
  });

  const [selectedRestaurant, setSelectedRestaurant] = useState<null | typeof restaurants[0]>(null);

  const onMapClick = useCallback(() => {
    setSelectedRestaurant(null); // Close InfoWindow when map is clicked
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={12}
      center={center}
      onClick={onMapClick}
    >
      //{ Render markers for each restaurant }
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={restaurant.position}
          onClick={() => setSelectedRestaurant(restaurant)}
        />
      ))}

     // { Show InfoWindow when a restaurant is selected }
      {selectedRestaurant && (
        <InfoWindow
          position={selectedRestaurant.position}
          onCloseClick={() => setSelectedRestaurant(null)}
        >
          <div>
            <h2>{selectedRestaurant.name}</h2>
            <p>{selectedRestaurant.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;




import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const Map = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
*/
