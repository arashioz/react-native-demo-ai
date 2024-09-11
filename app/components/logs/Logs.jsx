import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Network from "expo-network";
import { AppContext } from "../../context/AppContext";

const Logs = () => {
  const [netLog, setNetLog] = useState(null);
  const { backendURL, health } = useContext(AppContext);
  useEffect(() => {
    const fetchNetworkState = async () => {
      try {
        const { isConnected } = await Network.getNetworkStateAsync();
        setNetLog(isConnected ? "YES" :"NO");
      } catch (error) {
        console.error("Error fetching network state:", error);
      }
    };

    fetchNetworkState();

    return () => {};
  }, []);

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={styles.Text}>
        phone has connect data : {netLog === null ? "Loading..." : String(netLog)}
      </Text>
      <Text style={styles.Text}>backendURL: {backendURL}</Text>
      <Text style={styles.Text}>healthAPI: {health}</Text>
    </SafeAreaView>
  );
};

export default Logs;

const styles = StyleSheet.create({
  Text: {
    padding: 20,
    borderBottomColor:'black',
    borderBottomWidth:2
  },
});
