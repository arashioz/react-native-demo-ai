import React, { useContext, useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { AppContext } from "../../context/AppContext";

const ImageWithOverlay = ({ data , imageURI }) => {
  const { anyData } = useContext(AppContext);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [scaledPolygons, setScaledPolygons] = useState([]);
  const [filterData , setFilterData] =  useState([])
  console.log(imageURI)
  const colors = [
    "rgba(255, 0, 0, 0.5)",
    "rgba(0, 255, 0, 0.5)",
    "rgba(0, 0, 255, 0.5)",
    "rgba(255, 165, 0, 0.5)",
    "rgba(75, 0, 130, 0.5)",
  ];

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    if (anyData) {
      // Fetch the natural dimensions of the image
      Image.getSize(imageURI.imageUrl, (width, height) => {
        setImageSize({ width, height });
      });
    }
  let filterIndex =   data.reports.filter(imageIndex => imageIndex.image_index === anyData.imageIndex)
  setFilterData([ filterIndex , ...filterData])

}, [ anyData.imageIndex]);

  // Function to calculate scaled points for the polygons based on the image and screen size
  const getPolygonPoints = (part_segments) => {
    if (!part_segments || !part_segments.x || !part_segments.y) return "";
    const widthRatio = screenWidth / imageSize.width;
    const heightRatio = (screenHeight * 0.4) / imageSize.height; // For 40% height

    return part_segments.x
      .map((x, index) => {
        const scaledX = Math.round(x * widthRatio);
        const scaledY = Math.round(part_segments.y[index] * heightRatio);
        return `${scaledX},${scaledY}`;
      })
      .join(" ");

  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: screenWidth, height: screenHeight * 0.4 }}>
        {/* Image with scaling to 100% width and 40% height */}
        <Image
          source={{ uri: imageURI.imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="stretch"
        />

        {/* SVG Overlay for displaying polygons */}
        <Svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: screenWidth,
            height: screenHeight * 0.4,
          }}
          viewBox={`0 0 ${screenWidth} ${screenHeight * 0.4}`}
        >
          {data.reports.filter( imageIndex => imageIndex.image_index === imageURI.imageIndex).map((part, index) => (
            <Polygon
              key={index}
              points={getPolygonPoints(part.part_segments)}
              fill={colors[index % colors.length]} // Use color from array
              stroke={colors[index % colors.length]}
              strokeWidth="0.5"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
};

export default ImageWithOverlay;

