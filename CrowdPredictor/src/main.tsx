import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import Home from './Home.tsx';
import Settings from './Settings.tsx'; // Import Settings component

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<App />} />
        <Route path="/settings" element={<Settings />} /> {/* Add Settings route */}
      </Routes>
    </Router>
  </StrictMode>
);