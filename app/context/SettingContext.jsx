import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [spinners, setSpinners] = useState({
    spinner1: false,
    spinner2: false,
    spinner3: false,
    spinner4: false,
    spinner5: false,
  });

  return (
    <SettingsContext.Provider value={{ spinners, setSpinners }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const getSettings = () => {
  const context = useSettings();
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
