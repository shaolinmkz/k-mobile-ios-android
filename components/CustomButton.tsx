import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../constants/colors";

interface Props {
  text: string;
  mode?: "dark" | "light";
  focus?: boolean;
  onPress?: () => void;
  icon?: any;
  customParentStyle?: any;
  customChildStyle?: any;
}

const CustomButton = ({
  text,
  mode,
  focus,
  onPress,
  customParentStyle,
  customChildStyle,
  icon,
}: Props) => {
  let backgroundColor;
  let textColor;
  let borderColor;

  if (mode === "dark" && focus) {
    borderColor = colors.white;
    backgroundColor = colors.white;
    textColor = colors.secondary;
  } else if (mode === "dark" && !focus) {
    borderColor = colors.white;
    backgroundColor = colors.secondary;
    textColor = colors.white;
  } else if (mode === "light" && focus) {
    borderColor = colors.primary;
    backgroundColor = colors.primary;
    textColor = colors.white;
  } else if (mode === "light" && !focus) {
    borderColor = colors.primary;
    backgroundColor = colors.white;
    textColor = colors.primary;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={{
        ...styles.button,
        backgroundColor,
        borderColor,
        ...customParentStyle,
      }}
      onPress={onPress}
    >
      <Text style={{ ...styles.text, color: textColor, ...customChildStyle }}>{text}</Text>
      {!!icon && <Image style={styles.icon} source={{ uri: icon }} />}
    </TouchableOpacity>
  );
};

CustomButton.defaultProps = {
  customParentStyle: {},
  customChildStyle: {},
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get("window").width / 3,
    borderRadius: 50,
    borderWidth: 1,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontFamily: "lato-regular",
    fontSize: Dimensions.get("window").width / 25,
  },
  icon: {},
});

export default CustomButton;
