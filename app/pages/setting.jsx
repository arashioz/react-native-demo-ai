import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import Slider from "@react-native-community/slider";
import { mockSetting } from "../mocks/setting.mock";
import { AppContext } from "../context/AppContext";

const APPLE_BLUE = "#0A84FF";
const APPLE_GRAY_DARK = "#3A3A3C";
const APPLE_WHITE = "#FFFFFF";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);

const SliderInput = ({ category, item, index, handleSliderChange }) => {
  const key = Object.keys(item)[0];
  const value = parseFloat(item[key]);

  return (
    <StyledView key={index} className="mb-4">
      <StyledText className="text-lg mb-2" style={{ color: APPLE_GRAY_DARK }}>
        {`${key}: ${value}`}
      </StyledText>
      <Slider
        style={{ width: "100%" }}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        value={value}
        onValueChange={(sliderValue) =>
          handleSliderChange(category, key, index, sliderValue)
        }
        thumbTintColor={APPLE_BLUE}
        minimumTrackTintColor={APPLE_BLUE}
        maximumTrackTintColor={APPLE_GRAY_DARK}
      />
    </StyledView>
  );
};

const SettingComponent = () => {
  const [settings, setSettings] = useState(
    JSON.parse(JSON.stringify(mockSetting))
  );
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [configName, setConfigName] = useState("");
  const [isSliderModalVisible, setSliderModalVisible] = useState(false);
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(null);
  const [activeConfigIndex, setActiveConfigIndex] = useState(null);
  const { fetchData, postData, putData, deleteData } = useContext(AppContext);

  const handleSliderChange = (category, key, valueIndex, value) => {
    setSettings((prevSettings) => {
      const updatedCategory = [...prevSettings[category]];
      updatedCategory[valueIndex][key] = value.toFixed(2);
      return {
        ...prevSettings,
        [category]: updatedCategory,
      };
    });
  };
  const fetchSettings = async () => {
    try {
      let response = await fetchData("/settings");
      let settingsData = response.map((element) => {
        return { name: element.settingName, settings: element.settings };
      });
      setSavedConfigs(settingsData);
      response.forEach((element, index) => {
        if (element.isActive == true) {
          setActiveConfigIndex(index);
        }
      });
    } catch (err) {}
  };
  useEffect(() => {
    fetchSettings();
  }, [activeConfigIndex , ]);

  const saveConfig = async () => {
    if (configName.trim()) {
      const newConfig = {
        name: configName,
        settings: JSON.parse(JSON.stringify(settings)),
      };
      if (selectedConfigIndex !== null) {
        const updatedConfigs = [...savedConfigs];
        updatedConfigs[selectedConfigIndex] = newConfig;
        setSavedConfigs(updatedConfigs);
      } else {
        console.log(newConfig);
        setSavedConfigs([...savedConfigs, newConfig]);
        await postData("/settings", {
          isActive: false,
          settingName: configName,
          settings: newConfig.settings,
        });
      }
      setConfigName("");
      setSettings(JSON.parse(JSON.stringify(mockSetting)));
      setSliderModalVisible(false);
      setSelectedConfigIndex(null);
    } else {
      alert("لطفاً یک نام تنظیم وارد کنید.");
    }
  };

  const editConfig = (index) => {
    setConfigName(savedConfigs[index].name);
    console.log(savedConfigs);
    setSettings(JSON.parse(JSON.stringify(savedConfigs[index].settings)));
    setSelectedConfigIndex(index);
    setSliderModalVisible(true);
  };

  const selectConfig = async (index) => {
    setActiveConfigIndex(index);
    console.log(savedConfigs);
    await putData("/settings/active", { name: savedConfigs[index].name });
  };

  const deleteConfigOnServer = async (index) => {
    // console.log(savedConfigs[index].name);
    let deleteResponse = await deleteData(
      `/settings/${savedConfigs[index].name}`
    );
    if (deleteResponse.code == "409") {
      Alert.alert(deleteResponse.message);
    }
    fetchSettings()
  };
  const deleteConfig = async (index) => {
    Alert.alert(
      "حذف تنظیم",
      "آیا مطمئن هستید که می‌خواهید این تنظیم را حذف کنید؟",
      [
        {
          text: "لغو",
          style: "cancel",
        },
        {
          text: "حذف",
          onPress: async () => {
            deleteConfigOnServer(index);
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <StyledText
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: APPLE_GRAY_DARK }}
      >
        تنظیمات ذخیره شده
      </StyledText>

      <ScrollView className="mb-4">
        {savedConfigs.map((config, index) => (
          <StyledView
            key={index}
            className={`mb-4 p-4 rounded-lg ${
              activeConfigIndex === index ? "bg-blue-200" : "bg-gray-200"
            }`}
          >
            <TouchableOpacity
              onPress={() => selectConfig(index)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <StyledText
                className="text-lg"
                style={{ color: APPLE_GRAY_DARK }}
              >
                {config.name}
              </StyledText>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  className="p-2 rounded-full bg-blue-500 mr-2"
                  onPress={() => editConfig(index)}
                >
                  <Text className="text-white">ویرایش</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 rounded-full bg-red-500"
                  onPress={() => deleteConfig(index)}
                >
                  <Text className="text-white">حذف</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </StyledView>
        ))}
      </ScrollView>

      <TouchableOpacity
        className="p-4 rounded-full bg-blue-500 mb-4"
        onPress={() => {
          setSettings(JSON.parse(JSON.stringify(mockSetting)));
          setConfigName("");
          setSelectedConfigIndex(null);
          setSliderModalVisible(true);
        }}
      >
        <Text className="text-white text-center text-lg">
          ایجاد کانفیگ جدید
        </Text>
      </TouchableOpacity>

      {/* Modal to display sliders and name input */}
      <Modal
        visible={isSliderModalVisible}
        animationType="slide"
        onRequestClose={() => setSliderModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white p-4">
          <StyledText
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: APPLE_GRAY_DARK }}
          >
            {selectedConfigIndex !== null ? "ویرایش کانفیگ" : "کانفیگ جدید"}
          </StyledText>

          <StyledInput
            placeholder="نام کانفیگ را وارد کنید"
            value={configName}
            onChangeText={setConfigName}
            style={{
              borderColor: APPLE_GRAY_DARK,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginBottom: 16,
              backgroundColor: APPLE_WHITE,
            }}
          />

          <ScrollView className="mb-4">
            {Object.keys(settings).map((category) => (
              <StyledView
                key={category}
                className="mb-4 p-4 rounded-lg bg-gray-100"
              >
                <StyledText
                  className="text-lg font-bold mb-2"
                  style={{ color: APPLE_GRAY_DARK }}
                >
                  {category}
                </StyledText>
                {settings[category].map((item, index) => (
                  <SliderInput
                    key={index}
                    category={category}
                    item={item}
                    index={index}
                    handleSliderChange={handleSliderChange}
                  />
                ))}
              </StyledView>
            ))}
          </ScrollView>

          <TouchableOpacity
            className="p-4 rounded-full bg-blue-500"
            onPress={saveConfig}
          >
            <Text className="text-white text-center text-lg">ذخیره کانفیگ</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingComponent;
