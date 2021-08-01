import React, { createContext, useContext, useEffect, useState } from 'react';

export const CookieContext = createContext();
export const useCookies = () => useContext(CookieContext);

export const CookieProvider = ({ children }) => {
  const [cookieValues, setCookieValues] = useState();

  useEffect(() => {
    const storedCookieValues = JSON.parse(
      localStorage.getItem('cookieValues')
    );
    setCookieValues(storedCookieValues);
  }, []);

  useEffect(() => {
    localStorage.setItem('cookieValues', JSON.stringify(cookieValues));
  }, [cookieValues])

  const exports = {
    cookieValues,
    setCookieValues,
  };

  return (
    <CookieContext.Provider value={exports}>{children}</CookieContext.Provider>
  );
};
