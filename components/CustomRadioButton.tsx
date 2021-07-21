import React from "react";
import { CSSProperties } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";

interface Props {
  text1?: string;
  text2?: string;
  checked: boolean;
  onSelect: () => void;
  customParentStyle?: any;
  customText1Style?: any;
  customText2Style?: any;
}

const CustomRadioButton = ({ text1, text2, onSelect, checked, customParentStyle, customText1Style, customText2Style }: Props) => {
  return (
    <TouchableOpacity activeOpacity={0.5} style={{ ...styles.radioBtn, ...customParentStyle }} onPress={onSelect}>
      <View>
        {!!text1 && (
          <Text
            style={{
              ...styles.radioTextName,
              color: checked ? colors.primary : colors.textColor,
              fontFamily: checked ? fonts.bold : styles.radioTextName.fontFamily,
              ...customText1Style,
            }}
          >
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text
            style={{
              ...styles.radioTextNumber,
              color: checked ? colors.primary : colors.textColor,
              fontFamily: checked ? fonts.bold : styles.radioTextName.fontFamily,
              ...customText2Style,
            }}
          >
            {text2}
          </Text>
        )}
      </View>

      <View
        style={{
          ...styles.radioCheckOuter,
          borderColor: checked ? colors.primary : colors.textColor,
        }}
      >
        <View
          style={{
            ...styles.radioCheckInner,
            backgroundColor: checked ? colors.primary : colors.white,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

CustomRadioButton.defaultProps = {
  customParentStyle: {},
  customText1Style: {},
  customText2Style: {},
};

const styles = StyleSheet.create({
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  radioCheckOuter: {
    backgroundColor: colors.white,
    borderWidth: 2,
    width: Dimensions.get("window").width / 18,
    height: Dimensions.get("window").width / 18,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCheckInner: {
    width: Dimensions.get("window").width / 35,
    height: Dimensions.get("window").width / 35,
    borderRadius: 25,
  },
  radioTextName: {
    color: colors.textColor,
    marginTop: 10,
    textTransform: "uppercase",
    fontFamily: fonts.regular,
    fontSize: Dimensions.get("window").width / 25,
  },
  radioTextNumber: {
    fontFamily: fonts.regular,
    color: colors.textColor,
    marginTop: 10,
    fontSize: Dimensions.get("window").width / 28,
  },
});

export default CustomRadioButton;
