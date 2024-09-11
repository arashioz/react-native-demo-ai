import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // For icons
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from 'expo-image-manipulator';

import ImageWithOverlay from "../components/imageProcessor/ImageOverly";
import axios from "axios";


const Main = () => {
  const [images, setImages] = useState([]);
  const [processedImage, setProcessedImage] = useState();

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [bufferImage, setBufferImage] = useState(null);
  const { backendURL, fileUpload , setAnyData} = useContext(AppContext);
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
    return result;
  };
  
  const compressImages = async (assets) => {
    return await Promise.all(
      assets.map(async (asset) => {
        const compressedImage = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1000 } }], // تغییر اندازه به عرض 1000 پیکسل
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // فشرده‌سازی و ذخیره به صورت JPEG
        );
        return compressedImage;
      })
    );
  };
  
  const uploadImages = async (assets) => {
    setLoading(true);
    const formData = new FormData();
  
    assets.forEach((asset, index) => {
      formData.append("files", {
        uri: Platform.OS === "ios" ? asset.uri.replace("file://", "") : asset.uri,
        name: `image-${index}.jpg`,
        type: `image/jpeg`,
      });
    });
    formData.append("data", JSON.stringify({ data: "string" }));

    try {
      const response = await fileUpload(`${backendURL}/Processor`, formData);
      setProcessedImage(response);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    // setModalVisible(true);
    setAnyData(imageUri)
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
      console.log("Processing images...");
    } else {
      await handleImageUpload();
      console.log("Processing images...");
    }
  };

  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 bg-gray-200 px-4"
    >
      <View className="py-4 bg-white shadow-lg rounded-lg mb-6 flex-row justify-between items-center px-4">
        <Text className="text-lg font-semibold text-gray-900">
          آپلود تصاویر
        </Text>
        <View className="flex gap-4 flex-row">
          <TouchableOpacity onPress={handleDeleteAllImages}>
            <Ionicons name="trash-outline" size={25} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={logHandler}>
            <Ionicons name="information-circle-sharp" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      {loading ? (
        <View className="text-center justify-between gap-5 items-center ">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>درحال پرداش</Text>
        </View>
      ) : (
        <View className="flex-wrap flex-row justify-center gap-6 mb-4">
          {images.length > 0 ? (
            images.map((image, index) => (
              <Pressable key={index} onPress={() => handleImagePress(image)}>
                <Image
                  source={{ uri: image }}
                  className="w-40 h-40 rounded-xl mb-4 border border-gray-200 shadow-md"
                />
              </Pressable>
            ))
          ) : (
            <View className="w-full h-24 justify-center items-center">
              <Text className="text-gray-500">هنوز عکسی آپلود نشده است</Text>
            </View>
          )}
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "80%",
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: 10,
                backgroundColor: "gray",
                borderRadius: 50,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", fontSize: 18 }}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="absolute bottom-5 left-10 right-10 py-2 bg-white/30 shadow-lg rounded-full flex-row justify-center items-center px-4 backdrop-blur-lg">
        {/* <TouchableOpacity
          className="flex items-center justify-center w-16 h-16 bg-transparent rounded-full shadow-md mx-4"
          onPress={handleImageUpload}
        >
          <Ionicons name="image-outline" size={24} color="gray" />
          <Text className="text-gray-700 text-sm font-medium mt-1">تصاویر</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          className="flex items-center justify-center w-16 h-16 bg-transparent rounded-full shadow-md mx-4"
          onPress={handleProcessImages}
        >
          <MaterialCommunityIcons name="brain" size={25} color="gray" />
          <Text className="text-gray-700 text-sm font-medium mt-1">پردازش</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full shadow-md mx-4"
          onPress={handleDeleteAllImages}
        >
          <Ionicons name="trash-outline" size={25} color="white" />
          <Text className="text-white text-sm font-medium mt-1">حذف</Text>
        </TouchableOpacity> */}

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
