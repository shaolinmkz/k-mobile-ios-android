import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import AccountItem from "../components/AccountItem";
import CustomButton2 from "../components/CustomButton2";
import CustomTextInput from "../components/CustomTextInput";
import TransferSuccessModal from "../components/TransferSuccessModal";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import {
  combinedValidators,
  fallbackResolver,
  sanitizePhoneNumber,
  ternaryResolver,
} from "../helpers";
import useAppState from "../hooks/useAppState";
import { handleTransfer, validatePhoneNumber } from "../redux/actions";
import {
  CHANGE_SETUP_INPUT,
  SET_TRANSFER_SUCCESSFUL,
  VALIDATED_OPTIONS_PHONE_NUMBER,
  VALIDATED_PHONE_NUMBER,
} from "../redux/types";

const SendMoney = ({ route, navigation }: React.ComponentProps<any>) => {
  const { selectedPhoneOrEmail, selectedContact } = route.params;

  const {
    isValidatingPhoneNumber,
    maxAmount,
    dispatch,
    validatedData,
    validatedDataOptions,
    linkedAliases,
    actionLoading,
    transferSuccessful,
    reversalDuration,
  } = useAppState();

  const [selectedValidationOption, setSelectedValidationOption] = useState("");
  const [localState, setLocalState] = useState({
    amount: "",
    remark: "",
    receiverId: "",
    charge: "0.00",
  });

  const { amount, remark, receiverId, charge } = localState;

  const MIN_AMOUNT = 10;

  type Tfields = "amount" | "remark" | "receiverId" | "charge";

  const handleInputChange = (field: Tfields) => (value: string) => {
    setLocalState((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (field === "receiverId") {
      dispatch({ type: VALIDATED_PHONE_NUMBER, payload: "" });
      dispatch({ type: VALIDATED_OPTIONS_PHONE_NUMBER, payload: [] });
      setSelectedValidationOption("");

      if (combinedValidators.phoneAndEmail(value) && !isValidatingPhoneNumber) {
        Keyboard.dismiss();
        validatePhoneNumber(dispatch)(value);
      }
    }
  };

  const isLinkedToMe = (value: string) => {
    return linkedAliases?.map(({ linkedId }) => linkedId).includes(value);
  };

  const handleInitializeStoreValues = () => {
    dispatch({ type: SET_TRANSFER_SUCCESSFUL, payload: false });
    dispatch({ type: VALIDATED_PHONE_NUMBER, payload: "" });
    dispatch({
      type: CHANGE_SETUP_INPUT,
      payload: { name: "receiverId", value: "" },
    });
    dispatch({ type: VALIDATED_OPTIONS_PHONE_NUMBER, payload: [] });
  };

  const handleSendMoney = () => {
    handleTransfer(dispatch)({
      amount,
      receiverId: fallbackResolver(
        receiverId,
        sanitizePhoneNumber(`${selectedContact?.phoneNumbers?.[0]?.number}`)
      ),
    });
  };

  const closeTransactionModal = () => {
    navigation.navigate("Home");
    handleInitializeStoreValues();
  };

  const validator = {
    amount: +amount < MIN_AMOUNT || +amount > Number(maxAmount),
    receiverId:
      !combinedValidators.phoneAndEmail(receiverId) ||
      isLinkedToMe(receiverId) ||
      isLinkedToMe(`${selectedContact?.phoneNumbers?.[0]?.number}`),
    notValidatedUser: [!selectedContact, !selectedValidationOption].every(
      (val) => val === true
    ),
  };

  useEffect(() => {
    let charge = "0.00";

    if (+amount > 1 && +amount <= 5000) {
      charge = "10";
    } else if (+amount > 5000 && +amount <= 50000) {
      charge = "25";
    } else if (+amount > 50000) {
      charge = "50";
    }

    handleInputChange("charge")(charge);
  }, [amount]);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              ...styles.container,
              paddingTop: !!selectedContact
                ? Dimensions.get("window").width / 10
                : undefined,
            }}
          >
            {!selectedContact && (
              <View
                style={{
                  marginTop: Dimensions.get("window").width / 10,
                  borderTopWidth: 1,
                  borderTopColor: colors.line,
                }}
              />
            )}

            {!!selectedContact && (
              <AccountItem
                displayColor={selectedContact.displayColor}
                initials={selectedContact.initials}
                name={selectedContact.name}
                phoneNumbers={`${selectedContact.phoneNumbers?.[0]?.number}`}
              />
            )}

            {!!validatedData && !!receiverId && (
              <AccountItem
                initials={`${`${validatedData}`
                  .split(" ")[0]
                  .slice(0, 1)}${`${validatedData}`
                  .split(" ")
                  [`${validatedData}`.split(" ").length - 1].slice(0, 1)}`}
                name={`${validatedData}`}
                phoneNumbers={`${receiverId}`}
              />
            )}

            {!!validatedDataOptions?.length &&
              Array.isArray(validatedDataOptions) &&
              !!receiverId && (
                <ScrollView style={{ maxHeight: 250 }}>
                  {/* @ts-ignore */}
                  {[...new Set(validatedDataOptions)].map(
                    (accountName, index) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={index}
                        onPress={() => setSelectedValidationOption(accountName)}
                      >
                        <AccountItem
                          isMultiple
                          checked={accountName === selectedValidationOption}
                          initials={`${`${accountName}`
                            .split(" ")[0]
                            .slice(0, 1)}${`${accountName}`
                            .split(" ")
                            [`${accountName}`.split(" ").length - 1].slice(
                              0,
                              1
                            )}`}
                          name={`${accountName}`}
                          phoneNumbers={`${receiverId}`}
                        />
                      </TouchableOpacity>
                    )
                  )}
                </ScrollView>
              )}

            <View
              style={{
                paddingHorizontal: Dimensions.get("window").width / 15,
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <View>
                {!selectedContact && (
                  <CustomTextInput
                    value={receiverId}
                    labelSize={Dimensions.get("window").width / 20}
                    label="Alias"
                    placeholder="Enter phone number or email"
                    autoCorrect={false}
                    autoCompleteType="off"
                    autoCapitalize="none"
                    maxLength={100}
                    onChangeText={handleInputChange("receiverId")}
                    labelColor={colors.labelColor}
                  />
                )}

                <CustomTextInput
                  value={amount}
                  labelSize={Dimensions.get("window").width / 20}
                  label="Amount"
                  clearButtonMode="while-editing"
                  placeholder="₦0.00"
                  autoCorrect={false}
                  keyboardType="numeric"
                  autoCompleteType="off"
                  autoCapitalize="none"
                  maxLength={100}
                  onChangeText={handleInputChange("amount")}
                  labelColor={colors.labelColor}
                  inputStyleOveride={{
                    fontSize: Dimensions.get("window").width / 20,
                  }}
                  error={
                    +amount > 0 && +amount > Number(maxAmount)
                      ? `Maximum transferable amount is ${maxAmount}`
                      : ternaryResolver(
                          +amount > 0 && +amount < MIN_AMOUNT,
                          `Minimum transferable amount is ${MIN_AMOUNT}`,
                          ""
                        )
                  }
                />

                <CustomTextInput
                  value={remark}
                  labelSize={Dimensions.get("window").width / 20}
                  label="Remark"
                  placeholder="Transaction remark"
                  autoCorrect={false}
                  autoCompleteType="off"
                  autoCapitalize="none"
                  maxLength={100}
                  onChangeText={handleInputChange("remark")}
                  labelColor={colors.labelColor}
                />

                <Text
                  style={{
                    color: colors.secondary,
                    paddingTop: Dimensions.get("window").width / 25,
                    marginTop: 10,
                    fontSize: Dimensions.get("window").width / 27.5,
                    textAlign: "center",
                  }}
                >
                  You will be charged{" "}
                  <Text style={{ color: colors.primary }}>₦{charge}</Text> for
                  this transaction
                </Text>

                {isValidatingPhoneNumber && (
                  <View
                    style={{
                      position: "relative",
                      marginTop: Dimensions.get("window").height / 40,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        left: 0,
                        top: 0,
                        backgroundColor: colors.primary,
                        height: 5,
                        shadowColor: colors.transparent,
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 5,
                        shadowOffset: {
                          width: 0,
                          height: 3,
                        },
                      }}
                    />
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        paddingVertical: Dimensions.get("window").height / 50,
                      }}
                    >
                      <ActivityIndicator
                        style={{ marginRight: 10 }}
                        color={colors.primary}
                        size="small"
                      />
                      <Text
                        style={{
                          fontSize: Dimensions.get("window").width / 20,
                          fontFamily: fonts.regular,
                          color: colors.labelColor,
                        }}
                      >
                        Verifying alias...
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View
                style={{
                  paddingVertical: Dimensions.get("window").width / 20,
                }}
              >
                <CustomButton2
                  onPress={handleSendMoney}
                  loading={actionLoading}
                  text="Send Money"
                  disabled={[
                    validator.amount,
                    validator.receiverId && !selectedContact,
                    isValidatingPhoneNumber,
                  ].includes(true)}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {transferSuccessful && (
        <TransferSuccessModal
          mode="dark"
          visible
          selectedPhoneOrEmail={fallbackResolver(
            receiverId,
            sanitizePhoneNumber(`${selectedContact?.phoneNumbers?.[0]?.number}`)
          )}
          amount={amount}
          receiversName={fallbackResolver(selectedContact?.name, fallbackResolver(validatedData, selectedValidationOption))}
          onClose={closeTransactionModal}
          reversalDuration={reversalDuration}
        />
      )}
    </>
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
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  accountHeading: {
    fontSize: 18,
    fontFamily: "lato-regular",
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
  },
});

export default SendMoney;
