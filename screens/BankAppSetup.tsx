import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { IInitialState, IAppState, IBank } from "../Interfaces";
import { CHANGE_SETUP_INPUT, SELECT_BANK } from "../redux/types";
import CustomTextInput from "../components/CustomTextInput";
import { combinedValidators, isValidAlphabet } from "../helpers";
import CustomButton from "../components/CustomButton";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomModal from "../components/CustomModal";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

const BankAppSetup = ({ navigation }: React.ComponentProps<any>) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

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
  } = appState;

  const handleNavigation = (nextScreen: string, triggerBtn: string) => {
    const isLinkUnlink =
      nextScreen === "AccountNumberList" && triggerBtn === "Link / Unlink";

    navigation.navigate({
      name: nextScreen,
      params: {
        isFirstTime: isLinkUnlink ? true : false,
        isLinking: isLinkUnlink,
      },
    });
  };

  const handleInputChange = (name: string) => (value: any) => {
    dispatch({ type: CHANGE_SETUP_INPUT, payload: { name, value } });
  };

  const handleBankSelectModal = () => {
    setModalOpen((prevState) => !prevState);
  };

  const handleBankSelect = (bank: IBank | undefined) => {
    dispatch({ type: SELECT_BANK, payload: bank });
    if (bank) {
      handleBankSelectModal();
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.inputContainer}>
          {!selectedBank && (
            <View style={styles.btnContainer}>
              <CustomButton
                text="Tap to select a bank"
                focus
                mode="light"
                onPress={handleBankSelectModal}
                customParentStyle={{
                  width: "100%",
                  backgroundColor: colors.secondary,
                  borderColor: colors.secondary,
                  paddingVertical: Dimensions.get("window").height / 50,
                  marginBottom: Dimensions.get("window").height / 50,
                }}
                customChildStyle={{
                  fontSize: Dimensions.get("window").height / 50,
                }}
              />
            </View>
          )}

          {selectedBank && (
            <View>
              <CustomTextInput
                value={selectedBank.label}
                label="Bank:"
                placeholder="bank"
                autoCorrect={false}
                autoCompleteType="off"
                autoCapitalize="none"
                disabled
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => handleBankSelectModal()}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.primary,
                    textAlign: "center",
                  }}
                >
                  Change
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => handleBankSelect(undefined)}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.primary,
                    textAlign: "center",
                  }}
                >
                  Clear
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          )}

          <CustomTextInput
            value={senderFullName}
            label="Name:"
            placeholder="Fullname"
            autoCorrect={false}
            autoCompleteType="off"
            autoCapitalize="none"
            maxLength={100}
            onChangeText={handleInputChange("senderFullName")}
            error={
              senderFullName &&
              (senderFullName?.length < 3 || !isValidAlphabet(senderFullName))
                ? "Enter a valid name"
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
              phoneNumber && !combinedValidators.phoneAndEmail(phoneNumber)
                ? "Enter a valid phone number or email"
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
              accountNumber && accountNumber?.length !== 10
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
              bvn && bvn?.length !== 11
                ? "Enter a valid bank verification number"
                : ""
            }
          />
        </View>
      </ScrollView>

      <CustomModal mode="plain" visible={modalOpen}>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
