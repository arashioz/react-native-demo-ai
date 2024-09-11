import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploadComponent = () => {
  const [images, setImages] = useState([]);

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets.map(asset => asset.uri));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>آپلود تصاویر</Text>
      </View>
      <ScrollView horizontal style={styles.imageContainer}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.image}
            />
          ))
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>هنوز عکسی آپلود نشده است</Text>
          </View>
        )}
            <ImageWithOverlay data={processedImage} />
            </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={handleImageUpload}
      >
        <Text style={styles.buttonText}>انتخاب تصاویر</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    padding: 16,
  },
  header: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  placeholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007aff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ImageUploadComponent;
