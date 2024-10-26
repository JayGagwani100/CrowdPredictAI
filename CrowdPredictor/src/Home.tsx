// src/Home.tsx
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Map from './components/Map'; // Import the Map component

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="app-title">Welcome to Crowd Predictor AI</h1>
      <img src="./public/unnamed-removebg-preview (2).png" alt="Description" className="home-image" /> {/* Add your image here */}
      <button onClick={() => navigate('/app')}>
        Enter App
      </button>
      <h1>Explore Restaurants Nearby!</h1>
      <div className="map-container">
        <Map searchResult={null} /> 
      </div>
    </div>
  );
};

export default Home;