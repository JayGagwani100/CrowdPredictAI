import axios from 'axios';

const API_KEY = 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo';

// Define the structure of the response for places
interface Place {
  name: string;
  place_id: string;
  address: string;
  rating: number | string;
  types: string[];
  busyness: string; 
  waitingTime: string; // Adding waiting time data here
}

// Helper function to generate random busyness levels
const generateBusyness = (hour: number): string => {
  if (hour >= 22 || hour <= 6) {
    // Higher chance of being near empty after 10 PM or before 6 AM
    return Math.random() < 0.7 ? 'Empty' : 'Slightly busy';
  } else {
    const rand = Math.random();
    if (rand < 0.3) {
      return 'Empty';
    } else if (rand < 0.6) {
      return 'Slightly busy';
    } else if (rand < 0.85) {
      return 'Busy';
    } else {
      return 'Busier than usual';
    }
  }
};

// Helper function to generate more specific waiting times
const generateWaitingTime = (busynessLevel: string): string => {
  console.log(`Generating waiting time for busyness level: ${busynessLevel}`); // Log busyness level

  if (busynessLevel === 'Empty') {
    const waitTime = `${randomInRange(1, 3)}-${randomInRange(4, 6)} mins`;
    console.log(`Waiting time for Empty: ${waitTime}`); // Log waiting time
    return waitTime;
  } else if (busynessLevel === 'Slightly busy') {
    const waitTime = `${randomInRange(7, 10)}-${randomInRange(11, 14)} mins`;
    console.log(`Waiting time for Slightly Busy: ${waitTime}`); // Log waiting time
    return waitTime;
  } else if (busynessLevel === 'Busy') {
    const waitTime = `${randomInRange(15, 18)}-${randomInRange(19, 22)} mins`;
    console.log(`Waiting time for Busy: ${waitTime}`); // Log waiting time
    return waitTime;
  } else if (busynessLevel === 'Busier than usual') {
    const highWaitTime = randomInRange(23, 120);
    let waitTime;
    if (highWaitTime <= 60) {
      waitTime = `${highWaitTime}-${highWaitTime + 3} mins`; // 3-minute increments up to 60 mins
    } else if (highWaitTime <= 120) {
      waitTime = `${highWaitTime}-${highWaitTime + 5} mins`; // 5-minute increments from 60 to 120 mins
    } else {
      waitTime = '120 mins +';
    }
    console.log(`Waiting time for Busier than usual: ${waitTime}`); // Log waiting time
    return waitTime;
  }

  console.log('No busyness level matched, returning N/A');
  return 'N/A';
};

// Utility function to generate random numbers within a range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Simulated API call to fetch busyness data
export const searchPlaceByQuery = async (query: string): Promise<Place[]> => {
  if (!query) {
    throw new Error('Query is required');
  }

  // Fetch search results from the Google Places API
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`);

  if (response.status !== 200) {
    throw new Error('Failed to fetch place details');
  }

  const data = response.data;

  if (data.status !== 'OK') {
    throw new Error(`Google API error: ${data.status}`);
  }

  // Process the results and generate busyness and waiting time
  return data.results.map((place: any) => {
    const currentHour = new Date().getHours();
    const busynessLabel = generateBusyness(currentHour);
    const waitingTime = generateWaitingTime(busynessLabel);
    
    return {
      name: place.name,
      place_id: place.place_id,
      address: place.formatted_address.replace(/PO Box/gi, ''),
      rating: place.rating || 'No rating',
      types: place.types,
      busyness: busynessLabel,
      waitingTime, // Add the calculated waiting time
    };
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

// Function to get popular times (currently not fully implemented)
export const getPopularTimes = async (placeId: string) => {
  const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${API_KEY}`);
  const data = response.data;
  return data;
};
