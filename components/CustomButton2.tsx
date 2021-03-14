import React from "react";
import { StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

interface Props {
  text: string,
  disabled?: boolean,
  onPress?: () => void
}

const CustomButton2 = ({ text, onPress, disabled }: Props) => {

  const disabledBtnStyle = disabled ? { backgroundColor: colors.disabled, } : {}
  const disabledTextStyle = disabled ? { color: colors.white } : {}

  return (
    <TouchableOpacity style={{ ...styles.button, ...disabledBtnStyle  }} onPress={disabled ? () => {} : onPress}>
      <Text style={{ ...styles.text, ...disabledTextStyle  }}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 50,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: 'lato-bold',
    fontSize: Dimensions.get('window').width / 25,
    color: colors.white
  }
});

export default CustomButton2;
