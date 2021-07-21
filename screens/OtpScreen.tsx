import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  INDEPENDENT_LINKING,
  INDEPENDENT_UNLINKING,
  INITIAL_LINKING,
} from "../constants/actions";
import CustomButton2 from "../components/CustomButton2";
import LinkSuccessModal from "../components/LinkSuccessModal";
import UninkSuccessModal from "../components/UninkSuccessModal";
import OtpTimer from "../components/OtpTimer";
import colors from "../constants/colors";
import { combinedValidators } from "../helpers";
import { isValidPhoneNumber } from "../helpers/index";
import useAppState from "../hooks/useAppState";
import useNavJourney from "../hooks/useNavJourney";
import {
  confirmIndependentLinking,
  confirmInitialLinking,
  confirmUnlink,
  initiateIndependentLinking,
  initiateInitialLinking,
  initiateUnlink,
} from "../redux/actions";

const OtpScreen = ({ navigation, route }: React.ComponentProps<any>) => {
  const { selectedPhoneOrEmail, account } = route.params;

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
  const [localActionLoading, setLocalActionLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(initialOtp);
  const { activeJourney } = useNavJourney();
  const { dispatch } = useAppState();

  const handleInput = (value: string, inputName: string, inputNum: number) => {
    setOtp((prevState) => ({ ...prevState, [inputName]: value }));

    if (inputName !== "char6" && value) {
      // @ts-ignore
      inputRefs[`char${inputNum + 1}`].focus();
    } else if (!value && inputName !== "char1") {
      // @ts-ignore
      inputRefs[`char${inputNum - 1}`].focus();
    }
  };

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  const handlePopUp = (value: boolean) => {
    setModalVisible(value);
  };

  const handleActionLoading = (value: boolean) => {
    setLocalActionLoading(value);
  };

  const handleResendOtp = useCallback(() => {
    if (activeJourney?.activeAction === INDEPENDENT_UNLINKING) {
      initiateUnlink(dispatch, true)({ userId: selectedPhoneOrEmail });
    } else if (activeJourney?.activeAction === INITIAL_LINKING) {
      initiateInitialLinking(dispatch, true)();
    } else if (activeJourney?.activeAction === INDEPENDENT_LINKING) {
      initiateIndependentLinking(
        dispatch,
        true
      )({ userId: selectedPhoneOrEmail });
    }
  }, [activeJourney, selectedPhoneOrEmail]);

  const handleConfirmOTP = () => {
    handleActionLoading(true);
    if (activeJourney?.activeAction === INDEPENDENT_UNLINKING) {
      confirmUnlink(dispatch)({ userId: selectedPhoneOrEmail, otp })
        .then((result) => {
          if (result) {
            handlePopUp(result);
          }
        })
        .finally(() => {
          handleActionLoading(false);
        });
    } else if (activeJourney?.activeAction === INITIAL_LINKING) {
      confirmInitialLinking(dispatch)({ otp })
        .then((result) => {
          if (result) {
            handlePopUp(result);
          }
        })
        .finally(() => {
          handleActionLoading(false);
        });
    } else if (activeJourney?.activeAction === INDEPENDENT_LINKING) {
      confirmIndependentLinking(dispatch)({ userId: selectedPhoneOrEmail, otp })
        .then((result) => {
          if (result) {
            handlePopUp(result);
          }
        })
        .finally(() => {
          handleActionLoading(false);
        });
    } else {
      handleActionLoading(false);
    }
  };

  const winDi = Dimensions.get("window");

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <View>
            <View style={styles.heading}>
              <Ionicons
                name={
                  Platform.OS === "ios"
                    ? "ios-lock-closed-outline"
                    : "md-lock-closed-outline"
                }
                size={winDi.height / 20}
                color={colors.primary}
              />
              <Text style={styles.headingText}>
                Kindly enter the 6-digit OTP sent to your phone number
              </Text>
            </View>

            <View style={styles.inputCollection}>
              {"* "
                .repeat(5)
                .split(" ")
                .map((_, index) => (
                  <TextInput
                    ref={(inputRef) => {
                      // @ts-ignore
                      inputRefs[`char${index + 1}`] = inputRef;
                    }}
                    key={index + 1}
                    secureTextEntry
                    spellCheck={false}
                    // @ts-ignore
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
            <OtpTimer callback={handleResendOtp} />
          </View>
          <View
            style={{
              paddingBottom: Dimensions.get("window").width / 10,
              backgroundColor: colors.white,
            }}
          >
            <CustomButton2
              text={`${activeJourney?.actionText} ${
                isValidPhoneNumber(selectedPhoneOrEmail)
                  ? "Phone Number"
                  : "Email"
              }`}
              onPress={handleConfirmOTP}
              loading={localActionLoading}
              disabled={[
                !combinedValidators.phoneAndEmail(selectedPhoneOrEmail),
                !Object.values(otp).every((value) => value !== ""),
              ].includes(true)}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {modalVisible &&
        [
          activeJourney?.activeAction === INDEPENDENT_LINKING,
          activeJourney?.activeAction === INITIAL_LINKING,
        ].includes(true) && (
          <LinkSuccessModal
            mode="dark"
            visible
            accountNumber={`${account?.accountNumber}`}
            selectedPhoneOrEmail={selectedPhoneOrEmail}
            handleModal={() => handleNavigation("Home")}
          />
        )}

      {modalVisible &&
        activeJourney?.activeAction === INDEPENDENT_UNLINKING && (
          <UninkSuccessModal
            mode="dark"
            visible
            accountNumber={`${account?.accountNumber}`}
            selectedPhoneOrEmail={selectedPhoneOrEmail}
            handleModal={() => handleNavigation("Home")}
          />
        )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: Dimensions.get("window").width / 15,
    justifyContent: "space-between",
  },
  heading: {
    width: "100%",
    paddingVertical: Dimensions.get("window").width / 10,
    alignItems: "center",
  },
  inputCollection: {
    paddingVertical: Dimensions.get("window").width / 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headingText: {
    fontSize: 15,
    paddingHorizontal: Dimensions.get("window").width / 15,
    paddingVertical: Dimensions.get("window").width / 25,
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
