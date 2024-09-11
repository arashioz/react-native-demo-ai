import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  TextInput,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import Slider from "@react-native-community/slider";
import { mockSetting } from "../mocks/setting.mock";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const SettingsComponent = () => {
  const [configs, setConfigs] = useState({
    default: initializeConfig(mockSetting),
  });
  const [currentConfig, setCurrentConfig] = useState("default");
  const [newConfigName, setNewConfigName] = useState("");
  const [checkboxValues, setCheckboxValues] = useState(initializeCheckboxValues(mockSetting));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSliderChange = useCallback((category, damageType, value) => {
    setConfigs((prevConfigs) => ({
      ...prevConfigs,
      [currentConfig]: {
        ...prevConfigs[currentConfig],
        [category]: {
          ...prevConfigs[currentConfig][category],
          [damageType]: value,
        },
      },
    }));
  }, [currentConfig]);

  const handleCheckboxChange = useCallback((category) => {
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [category]: !prevValues[category],
    }));
  }, []);

  const handleCreateNewConfig = () => {
    if (!newConfigName.trim()) return; // Avoid creating a config with an empty name

    setConfigs((prevConfigs) => ({
      ...prevConfigs,
      [newConfigName]: initializeConfig(mockSetting),
    }));
    setCurrentConfig(newConfigName);
    setNewConfigName(""); // Reset the input field
    setIsModalVisible(false); // Close the modal
  };

  const renderCategory = useCallback((category) => {
    return (
      <StyledView key={category} style={{ marginBottom: 24 }}>
        <CategoryHeader
          category={category}
          isChecked={checkboxValues[category]}
          onToggle={() => handleCheckboxChange(category)}
        />
        {checkboxValues[category] && renderSliders(category)}
      </StyledView>
    );
  }, [configs, currentConfig, checkboxValues, handleCheckboxChange]);

  const renderSliders = (category) => {
    return mockSetting[category].map((item, index) => {
      const damageType = Object.keys(item)[0];
      const value = configs[currentConfig][category][damageType];

      return (
        <StyledView key={index} style={{ marginBottom: 16 }}>
          <SliderWithLabel
            damageType={damageType}
            value={value}
            onValueChange={(newValue) => handleSliderChange(category, damageType, newValue)}
          />
        </StyledView>
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header
        currentConfig={currentConfig}
        onOpenModal={() => setIsModalVisible(true)}
      />

      <ScrollView style={{ paddingHorizontal: 16 }}>
        {Object.keys(mockSetting).map((category) => renderCategory(category))}
      </ScrollView>

      <ConfigModal
        isVisible={isModalVisible}
        configs={configs}
        currentConfig={currentConfig}
        onSelectConfig={(config) => {
          setCurrentConfig(config);
          setIsModalVisible(false);
        }}
        newConfigName={newConfigName}
        onConfigNameChange={setNewConfigName}
        onCreateNewConfig={handleCreateNewConfig}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default SettingsComponent;

const initializeConfig = (mockData) => {
  return Object.keys(mockData).reduce((acc, key) => {
    acc[key] = mockData[key].reduce((innerAcc, item) => {
      const damageType = Object.keys(item)[0];
      innerAcc[damageType] = parseFloat(item[damageType]);
      return innerAcc;
    }, {});
    return acc;
  }, {});
};

const initializeCheckboxValues = (mockData) => {
  return Object.keys(mockData).reduce((acc, key) => {
    acc[key] = true; // Default to all settings enabled
    return acc;
  }, {});
};

const Header = ({ currentConfig, onOpenModal }) => (
  <StyledView style={{ padding: 16, backgroundColor: '#007AFF', alignItems: 'center' }}>
    <StyledText style={{ color: '#FFF', fontSize: 18, fontWeight: '600' }}>
      Config: {currentConfig}
    </StyledText>
    <TouchableOpacity onPress={onOpenModal}>
      <StyledText style={{ color: '#FFF', fontSize: 14, marginTop: 4 }}>
        Change Config
      </StyledText>
    </TouchableOpacity>
  </StyledView>
);

const ConfigModal = ({
  isVisible,
  configs,
  currentConfig,
  onSelectConfig,
  newConfigName,
  onConfigNameChange,
  onCreateNewConfig,
  onClose,
}) => (
  <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StyledView style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' }}>
        <StyledText style={{ fontSize: 20, fontWeight: '600', textAlign: 'center' }}>
          Select or Create Config
        </StyledText>
      </StyledView>
      <ScrollView style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        {Object.keys(configs).map((configName) => (
          <TouchableOpacity
            key={configName}
            onPress={() => onSelectConfig(configName)}
            style={{
              backgroundColor: currentConfig === configName ? '#007AFF' : '#E5E5EA',
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: currentConfig === configName ? '#FFF' : '#000' }}>
              {configName}
            </Text>
          </TouchableOpacity>
        ))}
        <StyledView style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
          <TextInput
            placeholder="New Config Name"
            value={newConfigName}
            onChangeText={onConfigNameChange}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#E5E5EA',
              padding: 10,
              borderRadius: 8,
              marginRight: 10,
            }}
          />
          <TouchableOpacity
            onPress={onCreateNewConfig}
            style={{
              backgroundColor: '#007AFF',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 16 }}>Create</Text>
          </TouchableOpacity>
        </StyledView>
      </ScrollView>
      <TouchableOpacity onPress={onClose} style={{ padding: 16, alignItems: 'center' }}>
        <StyledText style={{ color: '#007AFF', fontSize: 16 }}>Close</StyledText>
      </TouchableOpacity>
    </SafeAreaView>
  </Modal>
);

const CategoryHeader = ({ category, isChecked, onToggle }) => (
  <StyledView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
    <Switch
      value={isChecked}
      onValueChange={onToggle}
      trackColor={{ false: "#E5E5EA", true: "#007AFF" }}
      thumbColor={isChecked ? "#007AFF" : "#f4f3f4"}
    />
    <StyledText style={{ fontSize: 15, color: '#3C3C43', marginLeft: 8 }}>
      Enable {category} settings
    </StyledText>
  </StyledView>
);

const SliderWithLabel = ({ damageType, value, onValueChange }) => (
  <>
    <StyledText style={{ fontSize: 15, color: '#3C3C43', marginBottom: 8 }}>
      {damageType}
    </StyledText>
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={0}
      maximumValue={1}
      step={0.01}
      minimumTrackTintColor="#007AFF"
      maximumTrackTintColor="#E5E5EA"
      thumbTintColor="#007AFF"
      style={{ height: 40 }}
      thumbStyle={{
        height: 30,
        width: 30,
        backgroundColor: "#FFF",
        borderColor: "#007AFF",
        borderWidth: 2,
        borderRadius: 15,
      }}
    />
    <StyledText style={{ fontSize: 13, color: '#3C3C43', marginTop: 8 }}>
      {typeof value === 'number' && !isNaN(value) ? value.toFixed(2) : "0.00"}
    </StyledText>
  </>
);
