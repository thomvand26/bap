// import { Auth } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';
import Head from 'next/head';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CREATE_SHOW } from '../routes';

export const GoogleApiContext = createContext();
export const useGoogleApi = () => useContext(GoogleApiContext);

export const GoogleApiProvider = ({ children }) => {
  const [oauth2Client, setOauth2Client] = useState();
  const [currentGoogleUser, setCurrentGoogleUser] = useState();
  const YTBaseURL = 'https://www.googleapis.com/youtube/v3';

  useEffect(() => {
    const CLIENT_ID = process.env.YT_CLIENT_ID;

    gapi.load('client', async () => {
      await gapi.client.init({
        clientId: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/youtube.upload',
      });
      setOauth2Client(gapi.auth2.getAuthInstance());
    });
  }, []);

  const isSignedIn = () => {
    return oauth2Client?.isSignedIn?.get?.();
  };

  useEffect(() => {
    if (!oauth2Client) return;
    // oauth2Client.isSignedIn.listen(() => {
    //   console.log(oauth2Client.currentUser.get());
    //   console.log(isSignedIn());
    // });
    // console.log(isSignedIn());
    setCurrentGoogleUser(isSignedIn() ? oauth2Client.currentUser.get() : null);
    // console.log(gapi.client.getToken());
  }, [oauth2Client]);

  useEffect(() => {
    if (!currentGoogleUser) return;
    // console.log(currentGoogleUser);
    console.log(currentGoogleUser.getBasicProfile());
  }, [currentGoogleUser]);

  const handleSignIn = () => {
    if (!oauth2Client) return;
    console.log('signing in!');
    // oauth2Client.authenticate();
    oauth2Client.signIn();
  };

  const uploadTestVideo = async () => {
    const videoData = {

    };
    
    const fetchOption = {
      method: 'POST'
    }
    const response = await fetch(`${YTBaseURL}/videos`)
  }

  const exports = { handleSignIn };

  return (
    <GoogleApiContext.Provider value={exports}>
      <Head>
        <script
          src="https://apis.google.com/js/api.js"
          type="application/javascript"
          key="google-api"
          // defer
        ></script>
      </Head>
      {children}
    </GoogleApiContext.Provider>
  );
};
