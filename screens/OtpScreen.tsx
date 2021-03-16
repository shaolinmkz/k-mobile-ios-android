// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import CustomButton2 from "../components/CustomButton2";
import LinkSuccessModal from "../components/LinkSuccessModal";
import OtpTimer from "../components/OtpTimer";
import colors from "../constants/colors";
import { combinedValidators } from "../helpers";
import { isValidPhoneNumber } from "../helpers/index";

const OtpScreen = ({ navigation, route }: React.ComponentProps<any>) => {
  const { selectedPhoneOrEmail } = route.params;
  const initialOtp = {
    char1: "",
    char2: "",
    char3: "",
    char4: "",
    char5: "",
    char6: "",
  };

  const inputRefs = {
    char1: null,
    char2: null,
    char3: null,
    char4: null,
    char5: null,
    char6: null,
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(initialOtp);

  const handleInput = (value: string, inputName: string, inputNum: number) => {
    setOtp((prevState) => ({ ...prevState, [inputName]: value }));

    if (inputName !== "char6" && value) {
      inputRefs[`char${inputNum + 1}`].focus();
    } else if (!value && inputName !== "char1") {
      inputRefs[`char${inputNum - 1}`].focus();
    }
  };

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  const handleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>
              Kindly enter the 6-digit OTP sent to your phone number
            </Text>
          </View>

          <View style={styles.inputCollection}>
            {"* "
              .repeat(5)
              .split(" ")
              .map((val, index) => (
                <TextInput
                  ref={(inputRef) => {
                    inputRefs[`char${index + 1}`] = inputRef;
                  }}
                  key={index + 1}
                  secureTextEntry
                  spellCheck={false}
                  value={otp[`char${index + 1}`]}
                  autoCorrect={false}
                  autoCompleteType="off"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  maxLength={1}
                  onChangeText={(value) =>
                    handleInput(value, `char${index + 1}`, index + 1)
                  }
                  style={styles.input}
                />
              ))}
          </View>
          <OtpTimer />
        </View>
        <View
          style={{
            paddingHorizontal: Dimensions.get("window").width / 15,
            paddingBottom: Dimensions.get("window").width / 10,
            backgroundColor: colors.white,
          }}
        >
          <CustomButton2
            text={`Link ${
              isValidPhoneNumber(selectedPhoneOrEmail)
                ? "Phone Number"
                : "Email"
            }`}
            onPress={handleModal}
            disabled={[
              !combinedValidators.phoneAndEmail(selectedPhoneOrEmail),
              !Object.values(otp).every((value) => value !== ""),
            ].includes(true)}
          />
        </View>
        <LinkSuccessModal
          mode="dark"
          visible={modalVisible}
          selectedPhoneOrEmail={selectedPhoneOrEmail}
          handleModal={() => handleNavigation("Home")}
        />
      </>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
  heading: {
    width: "100%",
    paddingVertical: Dimensions.get("window").width / 10,
  },
  inputCollection: {
    paddingVertical: Dimensions.get("window").width / 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingText: {
    fontSize: 15,
    paddingHorizontal: Dimensions.get("window").width / 15,
    fontFamily: "lato-regular",
    textAlign: "center",
  },
  input: {
    fontSize: Dimensions.get("window").width / 20,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 2,
    flex: 1 / 6,
    height: Dimensions.get("window").height / 15,
    textAlign: "center",
  },
});

export default OtpScreen;
