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

  const dbSaveShow = async (data) => {
    console.log('saving show: ', data);
    try {
      const response = await axios.post(`${API_SHOW}/${data?._id || ''}`, data);
      if (response?.status === 200) {
        return response?.data?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const dbDeleteShow = async (data, userId) => {
    console.log('deleting show: ', data);
    try {
      if (data?.owner?._id !== userId) {
        throw new Error('You can only delete your own shows.');
      }

      if (!data?._id) throw new Error('No show id.');
      const response = await axios.delete(`${API_SHOW}/${data._id}`);
      if (response?.status === 200) {
        return response?.data?.data;
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const exports = { dbSaveShow, dbDeleteShow, getShow, getShows };

  return (
    <DatabaseContext.Provider value={exports}>
      {children}
    </DatabaseContext.Provider>
  );
};
