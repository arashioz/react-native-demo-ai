
const SliderInput = ({ category, item, index, handleSliderChange }) => {
  const key = Object.keys(item)[0];
  const value = parseFloat(item[key]);

  return (
    <StyledView key={index} style={{ marginBottom: 16 }}>
      <StyledText
        className="text-lg"
        style={{ color: APPLE_GRAY_DARK, marginBottom: 8 }}
      >
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