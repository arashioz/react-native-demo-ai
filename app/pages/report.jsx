import React, { useContext } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
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
  const { anyData, setAnyData } = useContext(AppContext);
console.log( "pr", processedImage)
  // تبدیل داده' JSON به Object
  const processedData = JSON.parse(processedImage);
console.log(processedData.reports)
  // ابعاد صفحه
  const { width, height } = Dimensions.get("window");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {/* تصویر همراه با Overlay */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <ImageWithOverlay
            imageURI={selectedImage}
            data={processedData}
          />
        </View>

        {/* جدول اطلاعات قطعات */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e0e0e0",
            borderRadius: 10,
            padding: 10,
            backgroundColor: "#f8f8f8",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 15,
              color: "#333",
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
                paddingVertical: 8,
                borderBottomWidth:
                  index !== processedData.reports.length - 1 ? 1 : 0,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ width: "40%", fontWeight: "bold", color: "#555" }}>
                {part.part_name}
              </Text>
              <Text
                style={{ width: "30%", textAlign: "center", color: "#555" }}
              >{`Confidence: ${(part.part_confidence * 100).toFixed(
                2
              )}%`}</Text>
              <Text
                style={{ width: "30%", textAlign: "center", color: "#555" }}
              >{`Damage: ${part.damage_name}`}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* دکمه بازگشت */}
      {/* <TouchableOpacity
        style={{
          position: "absolute",
          top: 15,
          left: 25,
          padding: 10,
          backgroundColor: "#4a90e2",
          borderRadius: 50,
          elevation: 5, // سایه دادن به دکمه برای زیبایی بیشتر
        }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Back</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default ImageOverlayScreen;
