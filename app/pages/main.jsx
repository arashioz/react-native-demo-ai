import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ImageBackground,
  Pressable,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AppContext } from "../context/AppContext";
import { useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";
import ImageOverlayScreen from "./report";
import { Modal } from "react-native";

const Main = () => {
  const [images, setImages] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [processedImage, setProcessedImage] = useState();
  const [loading, setLoading] = useState(false);
  const { backendURL, fileUpload, setAnyData, anyData } =
    useContext(AppContext);
  const router = useRouter();

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 1,
    });

    if (!result.canceled) {
      const compressedImages = await compressImages(result.assets);
      setImages(compressedImages.map((asset) => asset.uri));
      uploadImages(compressedImages);
    }
  };

  const compressImages = async (assets) => {
    return await Promise.all(
      assets.map(async (asset) => {
        const compressedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1000 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        return compressedImage;
      })
    );
  };

  const uploadImages = async (assets) => {
    setLoading(true);
    const formData = new FormData();
    let stateImageData = [];
    assets.forEach((asset, index) => {
      formData.append("files", {
        uri:
          Platform.OS === "ios" ? asset.uri.replace("file://", "") : asset.uri,
        name: `image-${index}.jpg`,
        type: `image/jpeg`,
      });
      stateImageData.push({
        imageIndex: index,
        imageUrl:
          Platform.OS === "ios" ? asset.uri.replace("file://", "") : asset.uri,
      });
    });
    setAnyData(stateImageData);

    formData.append("data", JSON.stringify({ data: "string" }));

    try {
      const response = await fileUpload(`${backendURL}/Processor`, formData);
      setProcessedImage(response);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleImagePress = () => {
    router.push({
      pathname: "pages/report",
      params: {
        processedImage: JSON.stringify(processedImage),
      },
    
    });
  };

  const handleDeleteAllImages = () => {
    setImages([]);
  };

  const settingHandler = () => {
    router.push("pages/setting");
  };

  const logHandler = () => {
    router.push("components/logs/Logs");
  };

  const handleProcessImages = async () => {
    if (images.length == 0) {
      await handleImageUpload();
    } else {
      await handleImageUpload();
    }
  };

  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 bg-gray-200 px-4 mt-10"
    >
      {}
      <View className="py-4 bg-white shadow-lg rounded-lg mb-6 flex-row justify-between items-center px-4">
        <Text className="text-lg  text-gray-900">آپلود تصاویر</Text>
        <View className="flex gap-4 flex-row">
          <TouchableOpacity onPress={handleDeleteAllImages}>
            <Ionicons name="trash-outline" size={25} color="#ff4757" />
          </TouchableOpacity>
          <TouchableOpacity onPress={logHandler}>
            <Ionicons
              name="information-circle-sharp"
              size={24}
              color="#1e90ff"
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="text-center justify-between gap-5 items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>درحال پردازش</Text>
        </View>
      ) : (
        <View className="relative flex justify-center items-center mb-4">
  
          {images.length > 0 ? (
            <TouchableOpacity
              onPress={handleImagePress}
              style={{
                backgroundColor: "#f1f2f6",
                borderRadius: 20,
                width: "100%",
                height: 200,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                top: 0,
                shadowRadius: 50,
                elevation: 5,
              }}
            >
              <ImageBackground
                source={{ uri: images[0] }}
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
                imageStyle={{
                  opacity: 0.3,
                }}
              >
                <Text className="text-white-200 border-2 rounded-lg bg-slate-50	p-2 text-lg">
                  مشاهده گزارش پردازش
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          ) : (
            <View className="w-full h-24 justify-center items-center">
              <Text className="text-gray-500">هنوز عکسی آپلود نشده است</Text>
            </View>
          )}
        </View>
      )}

      <View className="absolute bottom-5 left-10 right-10 py-2 bg-white/30 shadow-lg rounded-full flex-row justify-center items-center px-4 backdrop-blur-lg">
        {loading ? (
          <TouchableOpacity
            className="flex items-center opacity-2 justify-center w-16 h-16 bg-transparent rounded-full shadow-md mx-4"
            onPress={handleProcessImages}
            disabled
          >
            <MaterialCommunityIcons name="brain" size={25} color="red" />
            <Text className="text-gray-500 text-sm font-medium mt-1">
              پردازش
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex items-center justify-center w-16 h-16 bg-transparent rounded-full shadow-md mx-4"
            onPress={handleProcessImages}
          >
            <MaterialCommunityIcons name="brain" size={25} color="gray" />
            <Text className="text-gray-700 text-sm font-medium mt-1">
              پردازش
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="flex items-center justify-center w-16 h-16 bg-transparent rounded-full shadow-md mx-4"
          onPress={settingHandler}
        >
          <Ionicons name="settings-outline" size={25} color="gray" />
          <Text className="text-gray-700 text-sm font-medium mt-1">
            تنظیمات
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Main;
