import React, { createContext, useContext, useEffect, useState } from 'react';
// import mongoose from 'mongoose';

export const DatabaseContext = createContext();
export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
  // useEffect(() => {
  //   (async () => {
  //     if (!mongoose) return;
  //     console.log(await mongoose);
  //     console.log(mongoose.connect);
  //     console.log(process.env.MONGO_URI);
  //     const db = await mongoose.connect(process.env.MONGO_URI, {
  //       useNewUrlParser: true,
  //       useUnifiedTopology: true,
  //     });
  //     console.log(db);
  //   })();
  // }, [mongoose]);

  const createShow = () => {
    console.log('creating show');
  };

  const exports = { createShow };

  return (
    <DatabaseContext.Provider value={exports}>
      {children}
    </DatabaseContext.Provider>
  );
};
