import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import * as Contacts from "expo-contacts";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";

interface ContactType {
  emails: [], phoneNumbers: [], firstName: string, lastName: string
}

const SelectAlias = ({ route }: React.ComponentProps<any>) => {
  const { account } = route.params;

  const [contacts, setContacts] = useState<ContactType[]>([{ emails: [], phoneNumbers: [], firstName: '', lastName: '' }]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  const handleCheck = (value: string) => {
    setSelectedPhoneNumber(value);
  };

  const availablePhoneNumbers = "*"
    .repeat(3)
    .split("*")
    .map((val, index) => `+234806${90 - index}2${40 + index}8${index}`);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: ['emails', 'phoneNumbers', 'firstName', 'lastName']
        });

        if (data?.length) {
          const contactData = data.map(({ emails, phoneNumbers, firstName, lastName }) => ({ emails, phoneNumbers, firstName, lastName }));
          console.log(contactData.slice(1, 2));
          setContacts(contactData)
        }
      }
    })();
  }, []);

  return (
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
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: Dimensions.get("window").width / 15,
            borderColor: colors.textColor,
            width: Dimensions.get("window").width / 15,
            height: Dimensions.get("window").width / 15,
            marginRight: Dimensions.get("window").width / 15,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: Dimensions.get("window").width / 20,
              position: "absolute",
              top: -Dimensions.get("window").height / 400,
            }}
          >
            +
          </Text>
        </TouchableOpacity>
        <Text style={{}}>Enter new Alias or choose below</Text>
      </View>

      <ScrollView style={styles.list}>
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
    fontFamily: "lato-bold",
  },
  phonebook: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
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
