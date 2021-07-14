import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_SHOW } from '@/routes';

export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
  const getShows = async (filters) => {
    try {
      const response = await axios.get(API_SHOW, { params: filters });
      if (response?.status === 200) {
        return response?.data?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getShow = async (id, filters) => {
    try {
      const response = await axios.get(`${API_SHOW}/${id}`, {
        params: filters,
      });
      if (response?.status === 200) {
        return response?.data?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const exports = { getShow, getShows };

  return (
    <DatabaseContext.Provider value={exports}>
      {children}
    </DatabaseContext.Provider>
  );
};
