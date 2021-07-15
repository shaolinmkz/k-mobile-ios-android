import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import CustomButton2 from "../components/CustomButton2";
import TransferSuccessModal from "../components/TransferSuccessModal";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber } from "../helpers";

const SendMoney = ({ route, navigation }: React.ComponentProps<any>) => {
  const { selectedPhoneOrEmail, selectedContact, account } = route.params;

  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [transferSuccessful, setTransferSuccessful] = useState(false);

  const handleAmount = (value: string) => {
    setAmount(value);
  };

  const handleRemark = (value: string) => {
    setRemark(value);
  };

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView style={{ backgroundColor: colors.white }}>
        <KeyboardAvoidingView behavior="position" style={styles.container}>
          <View>
            <View style={styles.account}>
              <Text style={styles.accountHeading}>Account to debit:</Text>
              <Text style={styles.accountText}>
                {account?.name ?? "Not Available"}
              </Text>
              <Text style={styles.accountText}>
                {account?.accountNumber ?? "Not Available"}
              </Text>
            </View>
            <View style={styles.account}>
              <Text
                style={{
                  ...styles.accountHeading,
                  marginBottom: !!selectedContact
                    ? Dimensions.get("window").width / 15
                    : 15,
                }}
              >
                Send money to:
              </Text>
              {!selectedContact && (
                <Text
                  style={{
                    fontFamily: "lato-regular",
                    color: colors.secondary,
                    fontSize: Dimensions.get("window").width / 22,
                  }}
                >
                  {selectedPhoneOrEmail}
                </Text>
              )}
              {!!selectedContact && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: Dimensions.get("window").width / 15,
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get("window").width / 7,
                      height: Dimensions.get("window").width / 7,
                      borderRadius: 100,
                      backgroundColor: selectedContact.displayColor,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: Dimensions.get("window").width / 30,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.white,
                        fontFamily: "lato-regular",
                        fontSize: Dimensions.get("window").width / 15,
                      }}
                    >
                      {selectedContact.initials}
                    </Text>
                  </View>

                  <View>
                    <Text
                      style={{
                        color: colors.secondary,
                        fontFamily: "lato-bold",
                        fontSize: Dimensions.get("window").width / 22,
                      }}
                    >
                      {selectedContact.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.secondary,
                        fontSize: Dimensions.get("window").width / 22,
                      }}
                    >
                      {sanitizePhoneNumber(
                        `${selectedContact.phoneNumbers?.[0]?.number}`
                      )}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.phonebook}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginRight: Dimensions.get("window").width / 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Dimensions.get("window").width / 20,
                      color: colors.secondary,
                      fontFamily: "lato-bold",
                    }}
                  >
                    Amount
                  </Text>
                </View>
                <TextInput
                  value={amount}
                  clearButtonMode="while-editing"
                  placeholder="₦0.00"
                  autoCorrect={false}
                  autoCompleteType="off"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  onChangeText={handleAmount}
                  style={{
                    fontSize: Dimensions.get("window").width / 25,
                    flex: 1,
                    minWidth: "60%",
                  }}
                />
              </View>
            </View>

            <View style={styles.phonebook}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginRight: Dimensions.get("window").width / 15,
                  }}
                >
                  <Text
                    style={{
                      fontSize: Dimensions.get("window").width / 20,
                      color: colors.secondary,
                      fontFamily: "lato-bold",
                    }}
                  >
                    Remark
                  </Text>
                </View>
                <TextInput
                  value={remark}
                  placeholder="Transaction remark"
                  autoCorrect={false}
                  autoCompleteType="off"
                  autoCapitalize="none"
                  maxLength={100}
                  onChangeText={handleRemark}
                  style={{
                    fontSize: Dimensions.get("window").width / 25,
                    flex: 1,
                    minWidth: "60%",
                  }}
                />
              </View>
            </View>

            <Text
              style={{
                color: colors.secondary,
                paddingHorizontal: Dimensions.get("window").width / 15,
                marginTop: 10,
              }}
            >
              You will be charged{" "}
              <Text style={{ color: colors.primary }}>₦0.00</Text> for this
              transaction
            </Text>
          </View>

          <View
            style={{
              paddingVertical: Dimensions.get("window").width / 20,
              paddingHorizontal: Dimensions.get("window").width / 15,
            }}
          >
            <CustomButton2
              onPress={() => {
                setTransferSuccessful(true);
              }}
              text="Send Money"
              disabled={[
                !combinedValidators.phoneAndEmail(
                  sanitizePhoneNumber(
                    selectedContact?.phoneNumbers?.[0]?.number ||
                      selectedPhoneOrEmail
                  )
                ),
                Number(amount) < 100,
              ].includes(true)}
            />
          </View>
          <TransferSuccessModal
            mode="dark"
            visible={transferSuccessful}
            selectedPhoneOrEmail={selectedPhoneOrEmail}
            amount={amount}
            receiversName={selectedContact?.name}
            handleModal={() => handleNavigation("Home")}
          />
        </KeyboardAvoidingView>
      </ScrollView>
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
});

export default SendMoney;
