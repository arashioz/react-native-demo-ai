// services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.171:3005', 
   
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = 'your-auth-token'; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    } else if (error.request) {
      console.error('No response:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
