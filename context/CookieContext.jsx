import React, { createContext, useContext, useEffect, useState } from 'react';

export const CookieContext = createContext();
export const useCookies = () => useContext(CookieContext);

export const CookieProvider = ({ children }) => {
  const [cookieValues, setCookieValues] = useState();

  useEffect(() => {
    const storedCookieValues = JSON.parse(
      sessionStorage.getItem('cookieValues')
    );
    setCookieValues(storedCookieValues);
  }, []);

  const exports = {
    cookieValues,
    setCookieValues,
  };

  return (
    <CookieContext.Provider value={exports}>{children}</CookieContext.Provider>
  );
};
