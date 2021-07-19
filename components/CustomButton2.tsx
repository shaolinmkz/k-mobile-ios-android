import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { anonymousFunc } from "../helpers";

interface Props {
  text: string;
  disabled?: boolean;
  onPress?: () => void;
  loading?: boolean;
}

const CustomButton2 = ({ text, onPress, disabled, loading }: Props) => {
  const disabledBtnStyle = disabled ? { backgroundColor: colors.disabled } : {};
  const disabledTextStyle = disabled ? { color: colors.white } : {};

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ ...styles.button, ...disabledBtnStyle }}
      onPress={[disabled, loading].includes(true) ? anonymousFunc : onPress}
    >
      {loading && (
        <ActivityIndicator
          animating={loading}
          size="small"
          color={colors.white}
        />
      )}
      {!loading && (
        <Text style={{ ...styles.text, ...disabledTextStyle }}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

CustomButton2.defaultProps = {
  loading: false,
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 5,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: Dimensions.get("window").width / 20,
    color: colors.white,
  },
});

export default CustomButton2;
