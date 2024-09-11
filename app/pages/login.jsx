import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { styled } from "nativewind";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../context/AppContext";

const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(
  StyledTouchableOpacity
);

const LoginScreen = () => {
  const [email, setEmail] = useState("developer");
  const [password, setPassword] = useState("123321");
  const [authenticate, setAuthenticate] = useState(false);
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const {login } = useContext(AppContext)
  const authenticateHandler = async () => {
  let isAuth =   await login({username:email , password:password})
    if (isAuth) {
      Alert.alert("Login Successful", "Welcome back!", [{ text: "OK" }]);
      await AsyncStorage.setItem("auth", JSON.stringify(true));
      return true;
    } else {
      Alert.alert("Login Failed", "Invalid email or password", [
        { text: "Try Again" },
      ]);
      return false;
    }
  };
  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
    });
  }, []);

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handleLogin = async () => {
    if (authenticateHandler()) {
      router.navigate("/pages/main");
    }
  };

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 5,
      stiffness: 150,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 5,
      stiffness: 150,
    });
  };

  return (
    <Animated.View
      style={[animatedOpacityStyle]}
      className="flex-1 justify-center items-center px-6 bg-white"
    >
      <StyledText className="text-3xl font-semibold text-gray-900 mb-1">
        AI Demo
      </StyledText>
      <StyledText className="text-1xl font-semibold text-gray-900 mb-12">
        yara724
      </StyledText>
      <StyledTextInput
        className="w-full h-14 border border-gray-300 rounded-md px-4 mb-4 bg-white text-gray-900 shadow-md"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#8E8E93"
      />
      <StyledTextInput
        className="w-full h-14 border border-gray-300 rounded-md px-4 mb-6 bg-white text-gray-900 shadow-md"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#8E8E93"
      />
      <AnimatedTouchableOpacity
        style={[animatedScaleStyle]}
        className="w-full h-14 bg-blue-600 rounded-md justify-center items-center shadow-lg"
        onPress={handleLogin}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <StyledText className="text-white text-lg font-medium">
          Sign In
        </StyledText>
      </AnimatedTouchableOpacity>
      <StyledText className="text-gray-500 mt-4">
        Forgot your password?
      </StyledText>
    </Animated.View>
  );
};

export default LoginScreen;
