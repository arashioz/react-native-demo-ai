import axios from 'axios';
import { getSettings } from '../context/SettingContext';
const createAxiosInstance = () => {
  const settings = getSettings();

  const $api = axios.create({
    baseURL: 'https://api.example.com', 
    headers: {
      'Content-Type': 'application/json',
    },
  });

  $api.interceptors.request.use(
    (config) => {
      config.data = {
        ...config.data,
        spinners: settings.spinners,
      };
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return $api;
};

export default createAxiosInstance;
