// src/services/googlePlacesService.ts
import axios from 'axios';

const API_KEY = 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo';

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
  
  
  //return response.data;
};

export const searchPlaceByQuery = async (query: string) => {

  // Implementation for searching place by query

  return { name: 'Example Place', place_id: 'example_place_id' }; // Example return value

};

export const getPopularTimes = async (placeId: string) => {
  // Implement Popular Times API call
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
  const data = response.data;
  return data;
};