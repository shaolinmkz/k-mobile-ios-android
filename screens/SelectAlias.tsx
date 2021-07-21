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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContact, ContactType } from "../hooks/useContact";
import colors from "../constants/colors";
import {
  combinedValidators,
  sanitizePhoneNumber,
  ternaryResolver,
} from "../helpers";
import fonts from "../constants/fonts";
import useAppState from "../hooks/useAppState";
import PageLoader from "../components/PageLoader";
import useNavJourney from "../hooks/useNavJourney";

const SelectAlias = ({ route, navigation }: React.ComponentProps<any>) => {
  const { account } = route.params;
  const { allContacts } = useAppState();
  const [selectedPhoneOrEmail, setSelectedPhoneOrEmail] = useState("");


  const { activeJourney } = useNavJourney();

  const {
    contactSearchTerm,
    contacts,
    searchedContacts,
    handleContactSearch,
    loadingContact,
  } = useContact();

  const contactData = contactSearchTerm?.length
    ? searchedContacts
    : ternaryResolver(contacts.length, contacts, allContacts);

  const handleNavigation = (contactSelected?: ContactType) => {
    navigation.navigate({
      name: "SendMoney",
      params: {
        selectedPhoneOrEmail: sanitizePhoneNumber(selectedPhoneOrEmail) || "",
        selectedContact: contactSelected,
        account,
        action: activeJourney?.action,
      },
    });
  };

  const handleSelect = (contactSelected: ContactType, value: string) => {
    if (combinedValidators.phoneAndEmail(sanitizePhoneNumber(value))) {
      setSelectedPhoneOrEmail(value);
      handleNavigation(contactSelected);
    }
  };

  const EmptyComponent = () => (
    <View
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Ionicons
        name={Platform.OS === "ios" ? "ios-people-sharp" : "md-people"}
        size={Dimensions.get("window").width / 6}
        color={colors.primary}
      />
      <Text
        style={{
          color: colors.secondary,
          fontSize: Dimensions.get("window").width / 22,
          fontFamily: fonts.bold,
        }}
      >
        No Contacts
      </Text>
    </View>
  </View>
  )

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.phonebook}>
          <TouchableOpacity
            onPress={() => handleNavigation(undefined)}
            activeOpacity={0.5}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical:  Dimensions.get("window").width / 15,
              paddingHorizontal: Dimensions.get("window").width / 15,
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={Dimensions.get("window").width / 12}
              style={{
                marginRight: Dimensions.get("window").width / 15,
                color: "#847DAB",
              }}
            />

            <Text
              style={{
                fontSize: Dimensions.get("window").width / 25,
                maxWidth: "80%",
                minWidth: "60%",
                color: "#847DAB",
              }}
            >
              Enter new Alias or choose below
            </Text>
          </TouchableOpacity>
        </View>

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

        {loadingContact && <PageLoader />}

        {!loadingContact && (
          <FlatList
            data={contactData}
            ListEmptyComponent={EmptyComponent}
            // ListEmptyComponent={PageLoader}
            keyExtractor={({ id }) => id}
            style={{
              padding: Dimensions.get("window").width / 15,
            }}
            renderItem={({ item }) => {
              return item.phoneNumbers?.[0]?.number ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: Dimensions.get("window").width / 20,
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
                      backgroundColor: item.displayColor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: Dimensions.get("window").width / 30,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: fonts.regular,
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
                        fontFamily: fonts.bold,
                        fontSize: Dimensions.get("window").width / 25,
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text style={{ color: colors.secondary }}>
                      {item.phoneNumbers?.[0]?.number}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : null;
            }}
          />
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
    fontFamily: fonts.regular,
  },
  phonebook: {
    width: "100%",
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
