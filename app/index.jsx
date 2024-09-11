import React, { useEffect, useState } from "react";
import Main from "./pages/main";
import LoginScreen from "./pages/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const authStatus = await AsyncStorage.getItem("auth");
        console.log(authStatus)
        setIsAuth(authStatus ? JSON.parse(authStatus) : false);
      } catch (error) {
        console.error("Error reading auth status:", error);
        setIsAuth(false);
      } finally {
        setLoading(false); 
      }
    };

    authenticate();
  }, []);

  return { isAuth, loading };
};

const App = () => {
  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ direction:'rtl', flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuth ? <Main /> : <LoginScreen />;
};

export default App;
