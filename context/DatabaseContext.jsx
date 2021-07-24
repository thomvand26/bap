import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { API_SHOW, API_SHOWS, API_USER } from '@/routes';

export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
  const getShows = async (filters) => {
    try {
      const response = await axios.post(API_SHOWS, filters);
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

  const updateUser = async (data) => {
    try {
      const response = await axios.post(API_USER, data);
      if (response?.status === 200) {
        return response?.data?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const exports = { getShow, getShows, updateUser };

  return (
    <DatabaseContext.Provider value={exports}>
      {children}
    </DatabaseContext.Provider>
  );
};
