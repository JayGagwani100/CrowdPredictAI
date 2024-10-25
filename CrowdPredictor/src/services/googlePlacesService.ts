import axios from 'axios';

const API_KEY = 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo';

// Define the structure of the response for places
interface Place {
  name: string;
  place_id: string;
  address: string;
  rating: number | string;
  types: string[];
}

// Function for searching places by query
export const searchPlaceByQuery = async (query: string): Promise<Place[]> => {
  if (!query) {
    throw new Error('Query is required');
  }

  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`);

  if (response.status !== 200) {
    throw new Error('Failed to fetch place details');
  }

  const data = response.data;

  if (data.status !== 'OK') {
    throw new Error(`Google API error: ${data.status}`);
  }

  // Return an array of places
  return data.results.map((place: any) => ({
    name: place.name,
    place_id: place.place_id,
    address: place.formatted_address,
    rating: place.rating || 'No rating',
    types: place.types,
  }));
};

// src/services/googlePlacesService.ts
export const textSearch = (query: string): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      query,
      type: 'restaurant',
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(`Error fetching places: ${status}`);
      }
    });
  });
};



// Function to get detailed information about a specific place
export const getPlaceDetails = async (placeId: string) => {
  if (!placeId) {
    console.error('Invalid placeId:', placeId); // Debug
    throw new Error('Place ID is required');
  }
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
  if (response.status !== 200) throw new Error('Failed to fetch place details');

  const data = response.data;
  const crowdLevel = data.result.current_opening_hours?.current_busy_percent || 0; // Some places may not have crowd info
  return { name: data.result.name, crowdLevel };
};

// Function to get popular times (currently not fully implemented)
export const getPopularTimes = async (placeId: string) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
  const data = response.data;
  return data;
};
