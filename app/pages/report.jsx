import React, { useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  SafeAreaView,
} from "react-native";
import ImageWithOverlay from "../components/imageProcessor/ImageOverly";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AppContext } from "../context/AppContext";

const ImageOverlayScreen = () => {
  const router = useRouter();
  const { selectedImage, processedImage } = useLocalSearchParams();
  const processedData = JSON.parse(processedImage);
  const { anyData } = useContext(AppContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 10,
          backgroundColor: "#F5F5F7",
        }}
      >
        {anyData.map((imageData, index) => (
          <View key={index} style={{ marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 }}>
            <ImageWithOverlay
              imageURI={imageData}
              data={processedData}
            />
          </View>
        ))}

        <View
          style={{
            borderWidth: 1,
            borderColor: "#e0e0e0",
            borderRadius: 15,
            padding: 15,
            backgroundColor: "#FFFFFF",
            marginTop: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: 24,
              marginBottom: 15,
              color: "#1C1C1E",
              textAlign: "center",
            }}
          >
            Part Information
          </Text>
          {processedData.reports.map((part, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth:
                  index !== processedData.reports.length - 1 ? 1 : 0,
                borderBottomColor: "#ECECEC",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  width: "40%",
                  fontWeight: "500",
                  color: "#2C2C2E",
                  fontSize: 16,
                }}
              >
                {part.part_name}
              </Text>
              <Text
                style={{
                  width: "30%",
                  textAlign: "center",
                  color: "#4A4A4C",
                  fontWeight: "400",
                  fontSize: 14,
                }}
              >
                {`Confidence: ${(part.part_confidence * 100).toFixed(2)}%`}
              </Text>
              <Text
                style={{
                  width: "30%",
                  textAlign: "center",
                  color: "#FF3B30",
                  fontWeight: "500",
                  fontSize: 14,
                }}
              >
                {`Damage: ${part.damage_name}`}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImageOverlayScreen;
