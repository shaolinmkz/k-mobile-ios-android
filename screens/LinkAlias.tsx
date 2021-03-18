import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber } from "../helpers";

const LinkAlias = ({ route, navigation }: React.ComponentProps<any>) => {
  const { account } = route.params;

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [selectedPhoneOrEmail, setSelectedPhoneOrEmail] = useState("");

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

  const availablePhoneNumbers = "*"
    .repeat(1)
    .split("*")
    .map((val, index) => `+234806${90 - index}2${40 + index}8${index}`)
    .concat("xyz@example.com");

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.account}>
          <Text style={styles.accountHeading}>Linking alias to:</Text>
          <Text style={styles.accountText}>
            {account?.name ?? "Not Available"}
          </Text>
          <Text style={styles.accountText}>
            {account?.accountNumber ?? "Not Available"}
          </Text>
        </View>

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
                fontSize: Dimensions.get("window").width / 25,
                maxWidth: "80%",
                minWidth: "60%",
              }}
            />
          </View>
        </View>

        <ScrollView style={styles.list}>
          <Text
            style={{
              ...styles.accountHeading,
              marginTop: Dimensions.get("window").width / 15,
              marginBottom: Dimensions.get("window").width / 20,
            }}
          >
            Available Phone Numbers / Emails
          </Text>
          {availablePhoneNumbers.map((phoneNumber) => (
            <CustomRadioButton
              checked={selectedPhoneOrEmail === phoneNumber}
              text1=""
              text2={phoneNumber}
              key={phoneNumber}
              onSelect={() => handleCheck(phoneNumber)}
            />
          ))}
        </ScrollView>
        <View
          style={{
            paddingVertical: Dimensions.get("window").width / 10,
            paddingHorizontal: Dimensions.get("window").width / 15,
          }}
        >
          <CustomButton2
            onPress={() => {
              navigation.navigate({
                name: "OtpScreen",
                params: {
                  selectedPhoneOrEmail: sanitizePhoneNumber(
                    selectedPhoneOrEmail
                  ),
                },
              });
            }}
            text="Proceed"
            disabled={
              !combinedValidators.phoneAndEmail(
                sanitizePhoneNumber(selectedPhoneOrEmail)
              )
            }
          />
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 18,
    fontFamily: "lato-regular",
  },
  phonebook: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  accountText: {
    fontSize: Dimensions.get("window").width / 30,
    fontFamily: "lato-light",
    marginTop: Dimensions.get("window").height / 50,
  },
  list: {
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
});

export default LinkAlias;