import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContact, ContactType } from "../hooks/useContact";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber } from "../helpers";

const SelectAlias = ({ route, navigation }: React.ComponentProps<any>) => {
  const { account } = route.params;

  const [inputFocus, setInputFocus] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [selectedPhoneOrEmail, setSelectedPhoneOrEmail] = useState("");
  // @ts-ignore
  const [selectedContact, setSelectedContact] = useState<ContactType>(null);

  const {
    contactSearchTerm,
    contacts,
    searchedContacts,
    handleContactSearch,
  } = useContact();

  const handleSelect = (item: ContactType, value: string) => {
    if (combinedValidators.phoneAndEmail(sanitizePhoneNumber(value))) {
      setSelectedPhoneOrEmail(value);
      setPhoneOrEmail(sanitizePhoneNumber(value));
      setSelectedContact(item);
      handleNavigation(item);
    }
  };

  const handlePhoneOrEmail = (value: string) => {
    setPhoneOrEmail(value);
    if (combinedValidators.phoneAndEmail(value)) {
      setSelectedPhoneOrEmail(value);
    } else {
      setSelectedPhoneOrEmail("");
    }
  };

  const handleNavigation = (sContact?: ContactType) => {
    navigation.navigate({
      name: "SendMoney",
      params: {
        selectedPhoneOrEmail: sanitizePhoneNumber(selectedPhoneOrEmail),
        selectedContact: sContact || selectedContact,
        account,
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {!inputFocus && (
          <View style={styles.phonebook}>
            <Text
              style={{
                ...styles.accountHeading,
                marginBottom: Dimensions.get("window").width / 30,
              }}
            >
              Enter email or phone number
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
                  borderColor: combinedValidators.phoneAndEmail(phoneOrEmail)
                    ? colors.primary
                    : colors.textColor,
                  width: Dimensions.get("window").width / 15,
                  height: Dimensions.get("window").width / 15,
                  marginRight: Dimensions.get("window").width / 15,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  backgroundColor: combinedValidators.phoneAndEmail(
                    phoneOrEmail
                  )
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
        )}

        <View style={styles.list}>
          <Text
            style={{
              ...styles.accountHeading,
              marginTop: Dimensions.get("window").width / 15,
              marginBottom: Dimensions.get("window").width / 20,
            }}
          >
            Contacts
          </Text>
          <View
            style={{
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderColor: colors.border,
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 5,
              }}
            >
              <Ionicons
                name="search-outline"
                size={24}
                color={colors.border}
                style={{ marginRight: Dimensions.get("window").width / 15 }}
              />
              <TextInput
                onFocus={() => setInputFocus(true)}
                onBlur={() => setInputFocus(false)}
                value={contactSearchTerm}
                placeholder="Search contact"
                autoCorrect={false}
                clearButtonMode="while-editing"
                autoCompleteType="off"
                autoCapitalize="none"
                onChangeText={handleContactSearch}
                maxLength={30}
                style={{
                  fontSize: Dimensions.get("window").width / 25,
                  flex: 1,
                  minWidth: "60%",
                }}
              />
            </View>
          </View>
        </View>

        <FlatList
          data={contactSearchTerm?.length ? searchedContacts : contacts}
          keyExtractor={({ id }) => id}
          style={{
            padding: Dimensions.get("window").width / 15,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Dimensions.get("window").width / 15,
              }}
              onPress={() =>
                handleSelect(item, `${item.phoneNumbers?.[0]?.number}`)
              }
            >
              <View
                style={{
                  width: Dimensions.get("window").width / 10,
                  height: Dimensions.get("window").width / 10,
                  borderRadius: 100,
                  backgroundColor: colors.secondary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: Dimensions.get("window").width / 30,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: "lato-regular",
                    fontSize: Dimensions.get("window").width / 25,
                  }}
                >
                  {item.initials}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    color: colors.secondary,
                    fontFamily: "lato-bold",
                    fontSize: Dimensions.get("window").width / 25,
                  }}
                >
                  {item.name}
                </Text>
                <Text style={{ color: colors.secondary }}>
                  {item.phoneNumbers?.[0]?.number}
                </Text>
                <Text style={{ color: colors.secondary }}>
                  {item.emails?.[0]?.email}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {combinedValidators.phoneAndEmail(
          sanitizePhoneNumber(selectedPhoneOrEmail)
        ) && (
          <View
            style={{
              paddingVertical: Dimensions.get("window").width / 20,
              paddingHorizontal: Dimensions.get("window").width / 15,
            }}
          >
            <CustomButton2
              onPress={() => handleNavigation(selectedContact)}
              text="Proceed"
              disabled={
                !combinedValidators.phoneAndEmail(
                  sanitizePhoneNumber(selectedPhoneOrEmail)
                )
              }
            />
          </View>
        )}
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
    fontSize: Dimensions.get("window").width / 25,
    fontFamily: "lato-light",
    marginTop: Dimensions.get("window").height / 50,
  },
  list: {
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
});

export default SelectAlias;
