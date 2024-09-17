import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { router } from "expo-router";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendURL, setBackendURL] = useState("http://192.168.0.166:3005");
  const [health, setHealth] = useState(null);
  const [anyData, setAnyData] = useState(null);
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("auth");
        console.log("🚀 ~ loadToken ~ savedToken:", savedToken)
        if (savedToken !== null) {
          setToken(savedToken);
        } else {
          router.push("pages/login");
        }
      } catch (error) {
        console.log("Error retrieving token:", error);
      }


      setLoading(false);
    };
    loadToken();
    checkAPIHealth();
  }, []);

  const api = axios.create({
    baseURL: backendURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      "Authorization" :`Bearer ${JSON.parse(token)}`
    },
  });


  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const authToken = response.data.access_token;
      setToken(authToken);
      console.log();
      api.defaults.headers.Authorization = `Bearer ${authToken}`;
      await AsyncStorage.setItem("auth", JSON.stringify(authToken));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    setToken(null);
    api.defaults.headers.Authorization = null;
    await AsyncStorage.removeItem("authToken");
  };

  const fetchData = async (endpoint) => {
    try {
      console.log(api.defaults)
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  const fileUpload = async (endpoint, data, headers = {}) => {
    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          Accept: "*/*",
          "Content-Type": "multipart/form-data",
          ...headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error("API call error:", error.message);
      if (error) {
        Alert.alert("application have err ", "reload", [
          {
            text: "reload",
            onPress: () => {
              window.location.reload(false);
            },
          },
        ]);
      }
      throw error;
    }
  };
  const postData = async (endpoint, data, header) => {
    try {
      const response = await api.post(endpoint, data, header);
      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  const putData = async (endpoint, data) => {
    try {
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  const deleteData = async (endpoint) => {
    try {
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  async function checkAPIHealth() {
    try {
      const response = await axios.get(`${backendURL}/health`);

      if (response.status === 200) {
        setHealth("connected to server");
      } else {
        setHealth("server is down");
      }
    } catch (error) {
      console.log("err : ", error);
    }
  }
  return (
    <AppContext.Provider
      value={{
        token,
        login,
        logout,
        fetchData,
        postData,
        fileUpload,
        putData,
        deleteData,
        loading,
        backendURL,
        health,
        anyData,
        setAnyData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
