import React, { useState } from 'react';
import Map from './Map'; // Ensure Map component is imported correctly
import './SearchBar.css'; // Import the CSS file

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to handle the search logic and call the Flask backend
  const handleSearch = async () => {
    if (!query) return;

    try {
      // Make a POST request to the Flask backend with the search query
      const response = await fetch('http://localhost:5001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // Send the query to backend
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setSearchResults(data.results); // Store the results in the state
        setErrorMessage(null); // Clear any previous errors
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching search results');
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a place..."
      />
      <button onClick={handleSearch}>Search</button>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <div className="search-results-container">
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <strong>{result.name}</strong> - {result.formatted_address} (Rating: {result.rating}) 
                <p>Busyness: {result.busyness || 'Unknown'}</p>
                <p>Estimated Waiting Time: {result.waiting_time || 'Unknown'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display error message if there's any */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}


    </div>
  );
};

export default SearchBar;