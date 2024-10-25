// src/services/googlePlacesService.ts
import axios from 'axios';

const API_KEY = 'YOUR_GOOGLE_API_KEY';

export const getPlaceDetails = async (placeId: string) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
  return response.data;
};

export const getPopularTimes = async (placeId: string) => {
  // Implement Popular Times API call
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
  const data = response.data;
  return data;
};