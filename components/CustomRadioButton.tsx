import React from "react";
import { StyleSheet, Text, Dimensions, TouchableOpacity, View } from "react-native";
import colors from "../constants/colors";

interface Props {
  text1: string,
  text2: string,
  checked: boolean,
  onSelect: () => void
}

const CustomRadioButton = ({ text1, text2, onSelect, checked }: Props) => {


  return (
    <TouchableOpacity style={styles.radioBtn} onPress={onSelect}>
    <View>
      <Text style={{ ...styles.radioTextName, color: checked ? colors.primary : colors.textColor }}>{text1}</Text>
      <Text style={{ ...styles.radioTextNumber, color: checked ? colors.primary : colors.textColor }}>{text2}</Text>
    </View>

    <View style={{ ...styles.radioCheckOuter, borderColor: checked ? colors.primary : colors.textColor }}>
      <View style={{  ...styles.radioCheckInner, backgroundColor: checked ? colors.primary : colors.white }} />
    </View>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  radioCheckOuter: {
    backgroundColor: colors.white,
    borderWidth: 2,
    width: Dimensions.get("window").width / 15,
    height: Dimensions.get("window").width / 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheckInner: {
    width: Dimensions.get("window").width / 30,
    height: Dimensions.get("window").width / 30,
    borderRadius: 25,
  },
  radioTextName: {
    color: colors.textColor,
    marginTop: 10,
    textTransform: 'uppercase',
    fontSize: Dimensions.get("window").width / 25,
  },
  radioTextNumber: {
    color: colors.textColor,
    marginTop: 10,
    fontSize: Dimensions.get("window").width / 28,
  },
});

export default CustomRadioButton;
