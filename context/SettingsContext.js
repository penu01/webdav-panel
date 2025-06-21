import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [thumbnailMode, setThumbnailMode] = useState('immediate'); // immediate, onHover, onDelayedHover, none

  // Load settings from localStorage on initial load
  useEffect(() => {
    const savedMode = localStorage.getItem('thumbnailMode');
    if (savedMode && ['immediate', 'onHover', 'onDelayedHover', 'none'].includes(savedMode)) {
      setThumbnailMode(savedMode);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const handleSetThumbnailMode = (mode) => {
    if (['immediate', 'onHover', 'onDelayedHover', 'none'].includes(mode)) {
      setThumbnailMode(mode);
      localStorage.setItem('thumbnailMode', mode);
    }
  };

  const value = {
    thumbnailMode,
    setThumbnailMode: handleSetThumbnailMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 