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
  Keyboard
} from "react-native";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber } from "../helpers";

const SelectAlias = ({ route }: React.ComponentProps<any>) => {
  const { account } = route.params;

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  const handleCheck = (value: string) => {
    setSelectedPhoneNumber(value);
    setPhoneOrEmail(sanitizePhoneNumber(value));
  };

  const handlePhoneOrEmail = (value: string) => {
    setPhoneOrEmail(value);
    if (combinedValidators.phoneAndEmail(value)) {
      setSelectedPhoneNumber(value);
    } else {
      setSelectedPhoneNumber('');
    }
  };

  const availablePhoneNumbers = "*"
    .repeat(1)
    .split("*")
    .map((val, index) => `+234806${90 - index}2${40 + index}8${index}`)
    .concat('xyz@example.com');

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
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
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                borderWidth: 1,
                borderRadius: Dimensions.get("window").width / 15,
                borderColor: combinedValidators.phoneAndEmail(phoneOrEmail) ? colors.primary : colors.textColor,
                width: Dimensions.get("window").width / 15,
                height: Dimensions.get("window").width / 15,
                marginRight: Dimensions.get("window").width / 15,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                backgroundColor: combinedValidators.phoneAndEmail(phoneOrEmail)
                  ? colors.primary
                  : colors.white,
              }}
            >
              <Text
                style={{
                  fontSize: Dimensions.get("window").width / 20,
                  color: combinedValidators.phoneAndEmail(phoneOrEmail)
                    ? colors.white
                    : colors.textColor,
                  position: "absolute",
                  top: -Dimensions.get("window").height / 400,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
            <TextInput
              value={phoneOrEmail}
              placeholder="08034662893"
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
              checked={selectedPhoneNumber === phoneNumber}
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
            onPress={() => {}}
            text="Proceed"
            disabled={!selectedPhoneNumber}
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

export default SelectAlias;
