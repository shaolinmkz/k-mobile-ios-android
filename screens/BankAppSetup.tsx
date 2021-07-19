import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { IInitialState, IAppState, IBank } from "../Interfaces";
import {
  CHANGE_SETUP_INPUT,
  SELECT_BANK,
  SHOW_FIELD_ERRORS,
  HIDE_FIELD_ERRORS,
  SET_SPLASH_SCREEN,
} from "../redux/types";
import { loginAction } from "../redux/actions";
import CustomTextInput from "../components/CustomTextInput";
import {
  combinedValidators,
  fallbackResolver,
  isValidAlphabet,
  showError,
  ternaryResolver,
  isAuthenticated,
} from "../helpers";
import CustomButton from "../components/CustomButton";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomModal from "../components/CustomModal";
import CustomSelect from "../components/CustomSelect";
import PageLoader from "../components/PageLoader";
import useSaveAppState from "../hooks/useSaveAppState";

const BankAppSetup = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [initializing, setInitializing] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Save app state hook
  useSaveAppState();

  const appState: IInitialState = useSelector(
    (state: IAppState) => state.appState
  );

  const {
    registeredBanks,
    senderFullName,
    accountNumber,
    bvn,
    phoneNumber,
    selectedBank,
    loginLoading,
    showFieldError,
  } = appState;

  const handleInputChange = (name: string) => (value: any) => {
    dispatch({ type: CHANGE_SETUP_INPUT, payload: { name, value } });
    dispatch({ type: HIDE_FIELD_ERRORS });
  };

  const handleBankSelectModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  const handleBankSelect = (bank: IBank | undefined) => {
    dispatch({ type: SELECT_BANK, payload: bank });
    dispatch({ type: HIDE_FIELD_ERRORS });

    if (bank) {
      handleBankSelectModal();
    }
  };

  const handleLogin = async () => {
    const payload = {
      username: selectedBank?.username,
      password: selectedBank?.password,
    };

    await loginAction(dispatch)(payload, selectedBank);
  };

  const validator = {
    senderFullName: [
      !isValidAlphabet(senderFullName),
      `${senderFullName}`.trim().split(" ").length < 2,
    ].includes(true),
    accountNumber: accountNumber?.length !== 10,
    bvn: bvn?.length !== 11,
    phoneNumber: !combinedValidators.phoneAndEmail(phoneNumber),
    selectedBank: !selectedBank?.value,
  };

  useEffect(() => {
    dispatch({ type: SET_SPLASH_SCREEN, payload: true });
    isAuthenticated(dispatch).then((isAuth) => {
      if (isAuth) {
        navigation.replace("Home");
      } else {
        setInitializing(false);
      }
    });
  }, []);

  useEffect(() => {
    // Preload bank logo
    if (typeof selectedBank?.appIcon === "string" && selectedBank?.appIcon?.length > 10) {
      Image.prefetch(selectedBank?.appIcon);
    }
  }, [selectedBank?.appIcon]);

  return initializing ? (
    <PageLoader />
  ) : (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <>
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <View style={styles.btnContainer}>
                <CustomSelect
                  text={fallbackResolver(selectedBank?.label, "Select a bank")}
                  onPress={handleBankSelectModal}
                  customParentStyle={{
                    width: "100%",
                    marginBottom: ternaryResolver(
                      validator.selectedBank && showFieldError,
                      Dimensions.get("window").height / 50,
                      undefined
                    ),
                  }}
                  customChildStyle={{}}
                />
              </View>

              <View>
                {validator.selectedBank && showFieldError && (
                  <Text
                    style={{
                      textAlign: "center",
                      color: colors.primary,
                      fontSize: 15,
                    }}
                  >
                    Please select a bank
                  </Text>
                )}
              </View>

              <CustomTextInput
                value={senderFullName}
                label="Name:"
                placeholder="Firstname Lastname"
                autoCorrect={false}
                autoCompleteType="off"
                autoCapitalize="none"
                maxLength={100}
                onChangeText={handleInputChange("senderFullName")}
                error={
                  showError(senderFullName, showFieldError) &&
                  validator.senderFullName
                    ? "Enter a valid name"
                    : ""
                }
              />

              <CustomTextInput
                value={accountNumber}
                label="Account No:"
                placeholder="Account number"
                autoCorrect={false}
                autoCompleteType="off"
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={100}
                onChangeText={handleInputChange("accountNumber")}
                error={
                  showError(accountNumber, showFieldError) &&
                  validator.accountNumber
                    ? "Enter a valid account number"
                    : ""
                }
              />

              <CustomTextInput
                value={bvn}
                label="BVN:"
                placeholder="Bank verification number"
                autoCorrect={false}
                autoCompleteType="off"
                autoCapitalize="none"
                keyboardType="numeric"
                maxLength={100}
                onChangeText={handleInputChange("bvn")}
                error={
                  showError(bvn, showFieldError) && validator.bvn
                    ? "Enter a valid bank verification number"
                    : ""
                }
              />

              <CustomTextInput
                value={phoneNumber}
                label="Alias:"
                placeholder="Phone number or email"
                autoCorrect={false}
                autoCompleteType="off"
                autoCapitalize="none"
                maxLength={100}
                onChangeText={handleInputChange("phoneNumber")}
                error={
                  showError(phoneNumber, showFieldError) &&
                  validator.phoneNumber
                    ? "Enter a valid phone number or email"
                    : ""
                }
              />
            </View>

            <View
              style={{
                ...styles.inputContainer,
                marginBottom: Dimensions.get("window").height / 20,
              }}
            >
              <CustomButton
                text="Login"
                focus
                mode="light"
                onPress={handleLogin}
                callback={() => dispatch({ type: SHOW_FIELD_ERRORS })}
                loading={loginLoading}
                disabled={Object.values(validator).includes(true)}
                customParentStyle={{
                  width: "100%",
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  height: Dimensions.get("window").height / 15,
                  marginBottom: Dimensions.get("window").height / 50,
                }}
                customChildStyle={{
                  fontSize: Dimensions.get("window").height / 40,
                }}
              />
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>

      {modalOpen && (
        <CustomModal animationType="slide" mode="plain" visible={modalOpen}>
          <FlatList
            data={registeredBanks}
            keyExtractor={({ value }) => value}
            renderItem={({ item: bank }) => (
              <CustomRadioButton
                checked={bank.value === selectedBank?.value}
                text1={bank.label}
                text2=""
                onSelect={() => handleBankSelect(bank)}
              />
            )}
          />
        </CustomModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "space-between",
    overflow: "scroll",
  },
  inputContainer: {
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderBottomColor: colors.border,
    borderBottomWidth: 0.5,
    marginTop: 20,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  headerText: {
    fontSize: Dimensions.get("window").width / 17,
    fontFamily: fonts.regular,
    color: colors.secondary,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Dimensions.get("window").height / 20,
  },
});

export default BankAppSetup;
