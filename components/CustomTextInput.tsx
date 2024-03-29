import React, { useRef } from "react";
import { StyleSheet, Text, Dimensions, View, TextInput, Keyboard } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { ternaryResolver } from "../helpers";
import { IInputProps } from "../Interfaces";

const CustomTextInput = (props: IInputProps) => {
  const {
    value,
    onChangeText,
    label,
    placeholder,
    autoCorrect,
    autoCompleteType,
    autoCapitalize,
    maxLength,
    keyboardType,
    error,
    disabled,
    clearButtonMode,
    labelSize,
    labelColor,
    inputStyleOveride,
  } = props;

  const inputRef = useRef<any>(null);

  const labelStyleProps: any = {};

  if(labelSize) {
    labelStyleProps.fontSize = labelSize
  }
  if(labelColor) {
    labelStyleProps.color = labelColor;
  }

  return (
    <View
      style={{
        ...styles.inputFrame,
        paddingBottom: ternaryResolver(
          disabled,
          15,
          styles.inputFrame.paddingVertical
        ),
      }}
      onTouchStart={() => inputRef?.current?.focus?.()}
    >
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={{ ...styles.label, ...labelStyleProps }}>{label}</Text>
        </View>
        <TextInput
          value={value}
          placeholder={placeholder}
          autoCorrect={autoCorrect}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          editable={!disabled}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={{ ...styles.inputStyle, ...inputStyleOveride }}
          ref={inputRef}
          clearButtonMode={clearButtonMode}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

CustomTextInput.defaultProps = {
  label: "Label:",
  placeholder: "Text placeholder",
  autoCorrect: false,
  autoCompleteType: "off",
  autoCapitalize: "none",
  maxLength: 100,
  error: "",
  keyboardType: undefined,
  clearButtonMode: undefined,
  disabled: false,
  onChangeText: () => {},
  inputStyleOveride: {},
};

const styles = StyleSheet.create({
  inputFrame: {
    width: "100%",
    paddingVertical: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    position: "relative",
  },
  error: {
    position: "absolute",
    color: colors.error,
    bottom: 10,
    fontSize: Dimensions.get("window").width / 36, // 12px
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputStyle: {
    fontFamily: fonts.regular,
    fontSize: Dimensions.get("window").width / 25,
    flex: 1,
    minWidth: "60%",
    color: colors.secondary,
  },
  label: {
    fontSize: Dimensions.get("window").width / 25,
    color: colors.secondary,
    fontFamily: fonts.bold,
  },
  labelContainer: {
    marginRight: Dimensions.get("window").width / 15,
  },
});

export default CustomTextInput;
