import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure App.tsx is in the same directory

// Select the root element in index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  // Initialize React and render the App component
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}