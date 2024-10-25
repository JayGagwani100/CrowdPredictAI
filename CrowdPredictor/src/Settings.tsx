import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

type SettingOptions = 'useCurrentLocation' | 'allowNotifications' | 'getRecommendations';

const Settings = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    useCurrentLocation: false,
    allowNotifications: false,
    getRecommendations: false,
  });

  const handleToggle = (option: SettingOptions) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [option]: !prevSettings[option],
    }));
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <div className="options-container">
        <div className="option">
          <span>Use Current Location</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.useCurrentLocation} 
              onChange={() => handleToggle('useCurrentLocation')} 
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="option">
          <span>Allow Notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.allowNotifications} 
              onChange={() => handleToggle('allowNotifications')} 
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="option">
          <span>Get Recommendations</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.getRecommendations} 
              onChange={() => handleToggle('getRecommendations')} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      <button className="back-button" onClick={() => navigate('/app')}>
        Back to App
      </button>
    </div>
  );
};

export default Settings;
