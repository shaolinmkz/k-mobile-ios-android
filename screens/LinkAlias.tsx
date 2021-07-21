import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber } from "../helpers";
import fonts from "../constants/fonts";
import useAppState from "../hooks/useAppState";
import {
  initiateIndependentLinking,
  initiateInitialLinking,
} from "../redux/actions";
import useNavJourney from "../hooks/useNavJourney";
import { INDEPENDENT_LINKING, INITIAL_LINKING } from "../constants/actions";

const LinkAlias = ({ route, navigation }: React.ComponentProps<any>) => {
  const { account, action } = route.params;

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [selectedPhoneOrEmail, setSelectedPhoneOrEmail] = useState("");
  const { phoneNumber, dispatch, actionLoading } = useAppState();
  const { activeJourney } = useNavJourney();

  const handleCheck = (value: string) => {
    setSelectedPhoneOrEmail(value);
    setPhoneOrEmail(sanitizePhoneNumber(value));
  };

  const handlePhoneOrEmail = (value: string) => {
    setPhoneOrEmail(value);
    if (combinedValidators.phoneAndEmail(value)) {
      setSelectedPhoneOrEmail(value);
    } else {
      setSelectedPhoneOrEmail("");
    }
  };

  const handleProceedToNextScreen = () => {
    navigation.navigate({
      name: "OtpScreen",
      params: {
        action,
        account,
        selectedPhoneOrEmail: sanitizePhoneNumber(selectedPhoneOrEmail),
      },
    });
  };

  const handleSendOTP = () => {
    if (activeJourney?.activeAction === INITIAL_LINKING) {
      initiateInitialLinking(dispatch)().then((result) => {
        if (result) {
          handleProceedToNextScreen();
        }
      });
    } else if (activeJourney?.activeAction === INDEPENDENT_LINKING) {
      initiateIndependentLinking(dispatch)({
        userId: selectedPhoneOrEmail,
      }).then((result) => {
        if (result) {
          handleProceedToNextScreen();
        }
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.account}>
          <Text style={styles.accountHeading}>Linking alias to:</Text>
          <Text style={styles.accountText}>
            {account?.senderFullName ?? "Not Available"}
          </Text>
          <Text style={styles.accountText}>
            {account?.accountNumber ?? "Not Available"}
          </Text>
        </View>
        <ScrollView style={styles.list}>
          <View style={styles.phonebook}>
            <Text
              style={{
                ...styles.accountHeading,
                marginBottom: Dimensions.get("window").width / 30,
              }}
            >
              Enter new Alias or choose below
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={Dimensions.get("window").width / 13}
                style={{
                  marginRight: Dimensions.get("window").width / 15,
                  color: combinedValidators.phoneAndEmail(phoneOrEmail)
                    ? colors.primary
                    : colors.textColor,
                }}
              />
              <TextInput
                value={phoneOrEmail}
                placeholder="Phone number or email"
                autoCorrect={false}
                autoCompleteType="off"
                autoCapitalize="none"
                onChangeText={handlePhoneOrEmail}
                style={{
                  fontFamily: fonts.regular,
                  fontSize: Dimensions.get("window").width / 25,
                  width: "100%",
                }}
              />
            </View>
          </View>

          <Text
            style={{
              ...styles.accountHeading,
              marginTop: Dimensions.get("window").width / 15,
              marginBottom: Dimensions.get("window").width / 20,
            }}
          >
            Available Phone Numbers / Emails
          </Text>
          <CustomRadioButton
            checked={selectedPhoneOrEmail === phoneNumber}
            text1=""
            text2={phoneNumber}
            key={phoneNumber}
            onSelect={() => handleCheck(`${phoneNumber}`)}
          />
        </ScrollView>
        <View
          style={{
            paddingHorizontal: Dimensions.get("window").width / 15,
            paddingBottom: Dimensions.get("window").width / 10,
            paddingTop: Dimensions.get("window").width / 20,
          }}
        >
          <CustomButton2
            onPress={handleSendOTP}
            text="Send OTP"
            loading={actionLoading}
            disabled={
              !combinedValidators.phoneAndEmail(
                sanitizePhoneNumber(selectedPhoneOrEmail)
              )
            }
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  account: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  accountHeading: {
    fontSize: Dimensions.get("window").width / 25,
    fontFamily: fonts.bold,
  },
  phonebook: {
    width: "100%",
    paddingVertical: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  accountText: {
    fontSize: Dimensions.get("window").width / 25,
    fontFamily: fonts.regular,
    marginTop: Dimensions.get("window").height / 50,
    textTransform: "capitalize",
  },
  list: {
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
});

export default LinkAlias;
