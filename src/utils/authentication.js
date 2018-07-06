//
// MyRA
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import jwtDecode from 'jwt-decode';
import axios from './axios';
import {
  SSO_BASE_URL,
  SSO_LOGIN_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN_FROM_SSO,
  REFRESH_TOKEN_FROM_SSO,
} from '../constants/API';
import { saveDataInLocalStorage, getDataFromLocalStorage } from './localStorage';
import { stringifyQuery } from './queryString';
import { LOCAL_STORAGE_KEY } from '../constants/variables';

/**
 * this method is called immediately at the very beginning in authReducer
 * to initialize the auth and user objects in Router.js
 * @returns {object} the object that contains authData and user
 */
export const getAuthAndUserFromLocal = () => {
  const user = getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER);
  const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
  return { authData, user };
};

/**
 *
 * @param {object} response the network response
 */
export const saveAuthDataInLocal = (response) => {
  const data = { ...response.data };
  data.jwtData = jwtDecode(data.access_token);

  saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH, data);
};

/**
 *
 * @param {object} newUser the new user object
 */
export const saveUserProfileInLocal = (newUser) => {
  saveDataInLocalStorage(LOCAL_STORAGE_KEY.USER, newUser);
};

/**
 *
 * @param {string} code the code received from Single Sign On
 */
export const getTokenFromSSO = (code) => {
  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };
  // make an application/x-www-form-urlencoded request with axios
  return axios({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: GET_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
  });
};

/**
 *
 * @param {string} refreshToken the refreshToken saved in localStorage
 */
export const refreshAccessToken = (refreshToken) => {
  const data = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };

  // make an application/x-www-form-urlencoded request with axios
  // pass isRetry in config so that it only tries to refresh once.
  return axios({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: REFRESH_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
    isRetry: true,
  });
};

/**
 * @returns {string} the refresh token
 */
const getRefreshTokenFromLocal = () => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
  return data && data.refresh_token;
};

/**
 * @returns {object} the parsed data from Json Web Token
 */
const getJWTDataFromLocal = () => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
  return data && data.jwtData;
};

/**
 *
 * @returns {boolean}
 */
const isTokenExpired = () => {
  const jstData = getJWTDataFromLocal();

  if (jstData) {
    return (new Date() / 1000) > jstData.exp;
  }
  return false;
};

/**
 *
 * @param {object} config
 * @returns {boolean}
 */
const isRangeAPIs = (config) => {
  if (config && config.baseURL) {
    return config.baseURL !== SSO_BASE_URL;
  }
  return true;
};

/**
 *
 * register an interceptor to refresh the access token when expired
 * case 1: access token is expired
 *  -> get new access token using the refresh token and try making the network again
 * case 2: both access and refresh tokens are expired
 *  -> sign out the user
 * @param {function} logout the logout action function
 * @returns {object} the config or err object
 */
export const registerAxiosInterceptors = (logout) => {
  axios.interceptors.request.use((c) => {
    const config = { ...c };
    if (isTokenExpired() && !config.isRetry && isRangeAPIs()) {
      const refreshToken = getRefreshTokenFromLocal();
      if (process.env.NODE_ENV !== 'production') console.log('Access token is expired. Trying to refresh it');
      return refreshAccessToken(refreshToken).then(
        (response) => {
          saveAuthDataInLocal(response);

          const data = response && response.data;
          const { token_type: type, access_token: token } = data;
          config.headers.Authorization = type && token && `${type} ${token}`;
          config.isRetry = true;
          return config;
        },
        (err) => {
          logout();
          if (process.env.NODE_ENV !== 'production') console.log('Refresh token is also expired. Signing out.');
          return err;
        },
      );
    }
    return config;
  });
};
