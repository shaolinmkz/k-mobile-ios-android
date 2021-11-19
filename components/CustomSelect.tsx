import React from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
} from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { ternaryResolver } from "../helpers";
import { anonymousFunc } from "../helpers/index";

interface Props {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  callback?: () => void;
  icon?: any;
  customParentStyle?: any;
  customChildStyle?: any;
}

const CustomSelect = ({
  text,
  onPress,
  callback,
  customParentStyle,
  customChildStyle,
  loading,
  disabled,
}: Props) => {

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...styles.button,
        ...customParentStyle,
      }}
      onPress={ternaryResolver(disabled, callback, onPress)}
      disabled={loading}
    >
      {!loading && (
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{ ...styles.text, ...customChildStyle }}
          >
            {text}
          </Text>

          <Text
            style={{
              ...styles.text,
              ...customChildStyle,
              fontSize: 18,
            }}
          >
            ⌵
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

CustomSelect.defaultProps = {
  customParentStyle: {},
  customChildStyle: {},
  callback: anonymousFunc,
  loading: false,
  disabled: false,
};

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get("window").width / 3,
    borderRadius: 0,
    borderBottomWidth: 1,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 50,
    backgroundColor: colors.white,
    borderColor: colors.line,
  },
  text: {
    fontSize: Dimensions.get("window").width / 25,
    color: colors.secondary,
    fontFamily: fonts.bold,
  },
});

export default CustomSelect;
