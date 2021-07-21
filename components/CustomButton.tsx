import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { ternaryResolver } from "../helpers";
import { anonymousFunc } from "../helpers/index";

interface Props {
  text: string;
  mode?: "dark" | "light";
  loading?: boolean;
  disabled?: boolean;
  focus?: boolean;
  onPress?: () => void;
  callback?: () => void;
  customParentStyle?: any;
  customChildStyle?: any;
  iconName?: any;
  iconColor?: any;
}

const CustomButton = ({
  text,
  mode,
  focus,
  onPress,
  callback,
  customParentStyle,
  customChildStyle,
  loading,
  disabled,
  iconName,
  iconColor,
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

  const winDi = Dimensions.get("window");

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...styles.button,
        backgroundColor,
        borderColor,
        ...customParentStyle,
      }}
      onPress={ternaryResolver(disabled, callback, onPress)}
      disabled={loading}
    >
      <>
      {loading && (
        <ActivityIndicator
          animating={loading}
          size="small"
          color={colors.white}
        />
      )}

      {!loading && !!text && (
        <Text style={{ ...styles.text, color: textColor, ...customChildStyle }}>
          {text}
        </Text>
      )}

      {!!iconName && !loading && <Ionicons name={iconName} color={iconColor} size={winDi.width / 15} />}
      </>
    </TouchableOpacity>
  );
};

CustomButton.defaultProps = {
  customParentStyle: {},
  customChildStyle: {},
  callback: anonymousFunc,
  loading: false,
  disabled: false,
  iconName: ""
};

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get("window").width / 3,
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 50,
  },
  text: {
    fontFamily: "lato-regular",
    fontSize: Dimensions.get("window").width / 25,
  },
});

export default CustomButton;
