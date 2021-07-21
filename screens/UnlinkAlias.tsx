import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Foundation } from "@expo/vector-icons";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber } from "../helpers";
import fonts from "../constants/fonts";
import useAppState from "../hooks/useAppState";
import { initiateUnlink } from "../redux/actions";
import useNavJourney from "../hooks/useNavJourney";

const UnlinkAlias = ({ route, navigation }: React.ComponentProps<any>) => {
  const { account, action } = route.params;
  const { activeJourney } = useNavJourney();

  const { linkedAliases, dispatch, actionLoading } = useAppState();
  const [selectedPhoneOrEmail, setSelectedPhoneOrEmail] = useState("");

  const handleCheck = (value: string) => {
    setSelectedPhoneOrEmail(value);
  };

  const handleNavigation = () => {
    navigation.navigate({
      name: "OtpScreen",
      params: {
        account,
        action,
        selectedPhoneOrEmail: sanitizePhoneNumber(
          selectedPhoneOrEmail
        ),
      ...activeJourney,
      },
    });
  }

  const handleSendOtp = () => {
    initiateUnlink(dispatch)({ userId: selectedPhoneOrEmail })
    .then(result => {
      if(result) {
        handleNavigation();
      }
    });
  }

  const winDi = Dimensions.get("window");

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.account}>
          <Text style={styles.accountHeading}>Unlinking alias from:</Text>
          <Text style={styles.accountText}>
            {account?.senderFullName ?? "Not Available"}
          </Text>
          <Text style={styles.accountText}>
            {account?.accountNumber ?? "Not Available"}
          </Text>
        </View>

        <ScrollView style={styles.list}>
          <Text
            style={{
              ...styles.accountHeading,
              marginTop: Dimensions.get("window").width / 15,
              marginBottom: Dimensions.get("window").width / 20,
            }}
          >
            Linked Phone Numbers / Emails
          </Text>
          {linkedAliases?.map(({ linkedId }) => (
            <CustomRadioButton
              checked={selectedPhoneOrEmail === linkedId}
              text2={linkedId}
              key={linkedId}
              onSelect={() => handleCheck(linkedId)}
              customText2Style={{
                fontSize: winDi.width / 25
              }}
            />
          ))}

          {!linkedAliases?.length && (
             <View
             style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
           >
             <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: winDi.height / 20 }}>
               <Foundation name="unlink" size={Dimensions.get("window").width / 6} color={colors.primary} />
               <Text
                 style={{
                   color: colors.secondary,
                   fontSize: Dimensions.get("window").width / 22,
                   fontFamily: fonts.bold,
                   padding: 20
                 }}
               >
                 No Linked Alias
               </Text>
             </View>
           </View>
          )}
        </ScrollView>
        <View
          style={{
            paddingVertical: Dimensions.get("window").width / 10,
            paddingHorizontal: Dimensions.get("window").width / 15,
          }}
        >
          <CustomButton2
            onPress={handleSendOtp}
            text="Send OTP"
            loading={actionLoading}
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
    fontFamily: fonts.bold,
  },
  phonebook: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  accountText: {
    fontSize: Dimensions.get("window").width / 25,
    fontFamily: fonts.regular,
    marginTop: Dimensions.get("window").height / 50,
    textTransform: "capitalize"
  },
  list: {
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
});

export default UnlinkAlias;
