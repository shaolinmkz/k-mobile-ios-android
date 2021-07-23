import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Input, Icon, Box } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import AccountItem from "../components/AccountItem";
import CustomButton2 from "../components/CustomButton2";
import CustomTextInput from "../components/CustomTextInput";
import TransferSuccessModal from "../components/TransferSuccessModal";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import {
  authenticateUserViaHardware,
  combinedValidators,
  fallbackResolver,
  isValidEmail,
  isValidPhoneNumber,
  sanitizePhoneNumber,
  ternaryResolver,
} from "../helpers";
import useAppState from "../hooks/useAppState";
import {
  handleFetchMaxTransferAmount,
  handleFetchReversalDuration,
  handleTransfer,
  validatePhoneNumber,
} from "../redux/actions";
import {
  CHANGE_SETUP_INPUT,
  SET_GLOBAL_ERROR,
  SET_TRANSFER_SUCCESSFUL,
  VALIDATED_OPTIONS_PHONE_NUMBER,
  VALIDATED_PHONE_NUMBER,
} from "../redux/types";

const SendMoney = ({ route, navigation }: React.ComponentProps<any>) => {
  const { selectedContact } = route.params;
  const modlRef1 = useRef(null);
  const modlRef2 = useRef(null);
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

  const [localIsValidatingPhoneNumber, setLocalIsValidatingPhoneNumber] =
    useState(false);
  const [hasValidatedAlias, setHasvalidatedAlias] = useState(!!selectedContact);
  const [localActionLoading, setLocalActionLoading] = useState(false);
  const [confirmationModalOpen, setComfirmationModalOpen] = useState(false);
  const [selectedValidationOption, setSelectedValidationOption] = useState("");
  const [localState, setLocalState] = useState({
    password: "",
    amount: "",
    remark: "",
    receiverId: "",
    charge: "0.00",
  });

  const PASSWORD = "123456";

  const { amount, remark, receiverId, charge } = localState;

  const MIN_AMOUNT = 10;

  type Tfields = "amount" | "remark" | "receiverId" | "charge" | "password";

  const handleInputChange = (field: Tfields) => (value: string) => {
    setLocalState((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (field === "receiverId") {
      dispatch({ type: VALIDATED_PHONE_NUMBER, payload: "" });
      dispatch({ type: VALIDATED_OPTIONS_PHONE_NUMBER, payload: [] });
      setSelectedValidationOption("");
      setHasvalidatedAlias(false);
    }
  };

  const handleAliasValidation = () => {
    dispatch({ type: VALIDATED_PHONE_NUMBER, payload: "" });
    dispatch({ type: VALIDATED_OPTIONS_PHONE_NUMBER, payload: [] });
    setSelectedValidationOption("");

    if (
      combinedValidators.phoneAndEmail(localState.receiverId) &&
      !isValidatingPhoneNumber &&
      !localIsValidatingPhoneNumber
    ) {
      setLocalIsValidatingPhoneNumber(true);
      Keyboard.dismiss();
      validatePhoneNumber(dispatch)(localState.receiverId).finally(() => {
        setLocalIsValidatingPhoneNumber(false);
        setHasvalidatedAlias(true);
      });
    }
  };

  const isLinkedToMe = (value: string) => {
    interface IAlias {
      linkedId: string;
    }
    return linkedAliases
      ?.map(({ linkedId }: IAlias) => linkedId)
      .includes(value);
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

  const closeConfirmationModalAndCleanup = () => {
    setComfirmationModalOpen(false);
    handleInputChange("password")("");
  };

  const handleSendMoney = async (auth: boolean) => {
    if (auth) {
      closeConfirmationModalAndCleanup();
      setLocalActionLoading(true);
      handleTransfer(dispatch)({
        amount,
        receiverId: fallbackResolver(
          receiverId,
          sanitizePhoneNumber(`${selectedContact?.phoneNumbers?.[0]?.number}`)
        ),
      }).finally(() => {
        setLocalActionLoading(false);
      });
    }
  };

  const handleBiometricTransfer = () => {
    authenticateUserViaHardware({
      promptMessage: "Biometric Confirmation",
    }).then((result) => {
      if (result) {
        handleSendMoney(result.success);
      } else {
        dispatch({
          type: SET_GLOBAL_ERROR,
          payload: "Biometric confirmation failed...",
        });
      }
    });
  };

  const handlePasswordTransfer = () => {
    if (localState.password === PASSWORD) {
      handleSendMoney(localState.password === PASSWORD);
    } else {
      dispatch({
        type: SET_GLOBAL_ERROR,
        payload: "Invalid password, please try again...",
      });
    }
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
      isLinkedToMe(
        sanitizePhoneNumber(`${selectedContact?.phoneNumbers?.[0]?.number}`)
      ),
    notValidatedUser: [!selectedContact, !selectedValidationOption].every(
      (val) => val === true
    ),
  };

  const errorMsg1 = "Must be a valid email or phone number";
  const errorMsg2 = "You can't transfer money to an alias linked to you";

  const resolveAliasEntryErrorMessage = () => {
    if (!combinedValidators.phoneAndEmail(receiverId)) {
      return errorMsg1;
    }
    if (
      isLinkedToMe(receiverId) ||
      isLinkedToMe(
        sanitizePhoneNumber(`${selectedContact?.phoneNumbers?.[0]?.number}`)
      )
    ) {
      return errorMsg2;
    }
    return undefined;
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

  useEffect(() => {
    handleFetchMaxTransferAmount(dispatch);
    handleFetchReversalDuration(dispatch);
  }, []);

  const winDi = Dimensions.get("window");
  const winHeightByThree = winDi.height / 3;
  // @ts-ignore
  const filterVidatedDataOptions = [...new Set(validatedDataOptions)];

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

            {!!filterVidatedDataOptions?.length &&
              Array.isArray(filterVidatedDataOptions) &&
              !!receiverId && (
                <ScrollView
                  style={{
                    maxHeight:
                      filterVidatedDataOptions.length > 2 &&
                      winHeightByThree > 250
                        ? winHeightByThree
                        : 250,
                  }}
                >
                  {filterVidatedDataOptions.map((accountName, index) => (
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
                  ))}
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
                    error={receiverId && resolveAliasEntryErrorMessage()}
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

                {[
                  localIsValidatingPhoneNumber,
                  isValidatingPhoneNumber,
                ].includes(true) && (
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
                  paddingBottom: Dimensions.get("window").width / 10,
                }}
              >
                {isLinkedToMe(
                  sanitizePhoneNumber(
                    `${selectedContact?.phoneNumbers?.[0]?.number}`
                  )
                ) && (
                  <Text
                    style={{
                      paddingVertical: 10,
                      color: colors.primary,
                      fontFamily: fonts.regular,
                      fontSize: winDi.width / 30,
                      textAlign: "center",
                    }}
                  >
                    {errorMsg2}
                  </Text>
                )}
                <CustomButton2
                  onPress={
                    hasValidatedAlias
                      ? () => setComfirmationModalOpen(true)
                      : handleAliasValidation
                  }
                  loading={localActionLoading || actionLoading}
                  text={
                    hasValidatedAlias
                      ? "Send Money"
                      : `Verify ${ternaryResolver(
                          isValidEmail(localState.receiverId),
                          "Email",
                          ternaryResolver(
                            isValidPhoneNumber(localState.receiverId),
                            "Phone Number",
                            "Alias"
                          )
                        )}`
                  }
                  disabled={[
                    validator.amount,
                    validator.receiverId && !selectedContact,
                    isLinkedToMe(receiverId),
                    isLinkedToMe(
                      sanitizePhoneNumber(
                        `${selectedContact?.phoneNumbers?.[0]?.number}`
                      )
                    ),
                    isValidatingPhoneNumber,
                    !!validatedDataOptions?.length && !selectedValidationOption,
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
          receiversName={fallbackResolver(
            selectedContact?.name,
            fallbackResolver(validatedData, selectedValidationOption)
          )}
          onClose={closeTransactionModal}
          reversalDuration={reversalDuration}
        />
      )}

      {confirmationModalOpen && (
        <TouchableWithoutFeedback
          onPress={(e) => {
            if (
              e.target === modlRef1.current ||
              e.target === modlRef2.current
            ) {
              closeConfirmationModalAndCleanup();
            }
          }}
        >
          <View
            ref={modlRef1}
            style={{
              position: "absolute",
              backgroundColor: colors.transparent,
              top: 0,
              bottom: 0,
              width: "100%",
              flex: 1,
            }}
          >
            <View
              ref={modlRef2}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: colors.white,
                  height: ternaryResolver(
                    winDi.height / 2 < 400,
                    400,
                    winDi.height / 2.1
                  ),
                  width: winDi.width / 1.1,
                  justifyContent: "center",
                  paddingHorizontal: winDi.width / 15,
                }}
              >
                <View
                  style={{
                    paddingBottom: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    style={{ marginBottom: 20 }}
                    name={ternaryResolver(
                      Platform.OS === "android",
                      "md-lock-closed-outline",
                      "ios-lock-closed-outline"
                    )}
                    size={winDi.height / 20}
                    color={colors.primary}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: colors.secondary,
                      fontFamily: fonts.regular,
                      fontSize: winDi.width / 20,
                    }}
                  >
                    Enter your password to confirm this transaction
                  </Text>
                </View>
                <Box w="100%" style={{ marginBottom: 30 }}>
                  <Input
                    style={{ padding: 10 }}
                    onChangeText={handleInputChange("password")}
                    value={localState.password}
                    secureTextEntry
                    keyboardType="numeric"
                    InputRightElement={
                      <TouchableOpacity
                        onPress={handleBiometricTransfer}
                        activeOpacity={0.7}
                      >
                        <Icon
                          as={
                            <Ionicons
                              name={ternaryResolver(
                                Platform.OS === "android",
                                "md-finger-print",
                                "ios-finger-print"
                              )}
                            />
                          }
                          size="md"
                          m={2}
                          _light={{
                            color: colors.primary,
                          }}
                        />
                      </TouchableOpacity>
                    }
                    placeholder="Password" // mx={4}
                    _light={{
                      placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                      placeholderTextColor: "blueGray.50",
                    }}
                  />
                </Box>

                <CustomButton2
                  onPress={handlePasswordTransfer}
                  text="Confirm"
                  loading={localActionLoading}
                  disabled={!localState.password}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
