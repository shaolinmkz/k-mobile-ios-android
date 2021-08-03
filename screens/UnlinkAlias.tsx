import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform
} from "react-native";
import { Foundation, Ionicons } from "@expo/vector-icons";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import { combinedValidators, sanitizePhoneNumber, ternaryResolver } from "../helpers";
import fonts from "../constants/fonts";
import useAppState from "../hooks/useAppState";
import { initiateUnlink } from "../redux/actions";
import useNavJourney from "../hooks/useNavJourney";

const UnlinkAlias = ({ route, navigation }: React.ComponentProps<any>) => {
  const { account, action } = route.params;
  const { activeJourney } = useNavJourney();

  const modlRef1 = useRef(null);
  const modlRef2 = useRef(null);
  const [confirmationModalOpen, setComfirmationModalOpen] = useState(false);

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
    Keyboard.dismiss();
    initiateUnlink(dispatch)({ userId: selectedPhoneOrEmail })
    .then(result => {
      if(result) {
        handleNavigation();
      }
    });
  }

  const winDi = Dimensions.get("window");
  const isAndroid = Platform.OS === "android";

  return (
    <>
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
            onPress={() => setComfirmationModalOpen(true)}
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

    {confirmationModalOpen && (
        <TouchableWithoutFeedback
          onPress={(e) => {
            if (
              e.target === modlRef1.current ||
              e.target === modlRef2.current
            ) {
              setComfirmationModalOpen(false);
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
                  padding: winDi.width / 15,
                  justifyContent: "space-between"
                }}
              >
                <View
                  style={{
                    paddingBottom: 20,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      color: colors.secondary,
                      fontFamily: fonts.bold,
                      fontSize: winDi.width / 20,
                    }}
                  >
                    Confirmation
                  </Text>

                  <TouchableOpacity onPress={() => setComfirmationModalOpen(false)}>
                    <Ionicons name={isAndroid ? "md-close-sharp" : "ios-close-sharp"} size={winDi.width / 12} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    paddingBottom: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "left",
                      color: colors.textColorLight,
                      fontFamily: fonts.regular,
                      fontSize: winDi.width / 25,
                    }}
                  >
                    Are you sure you want to unlink <Text style={{ fontFamily: fonts.bold }}>{`${selectedPhoneOrEmail}`}</Text> from this account number <Text style={{ fontFamily: fonts.bold }}>{`${account.accountNumber}`}</Text>?
                  </Text>
                </View>

                <View>
                    <View style={{ width: "100%", borderTopColor: colors.line, borderTopWidth: 2, }} />

                  <View style={{ marginTop: winDi.height / 20, flexDirection: "row", justifyContent: "center" }}>
                  <CustomButton2
                      onPress={() => setComfirmationModalOpen(false)}
                      text="Cancel"
                      customStyle={{ width: winDi.width / 3, backgroundColor: colors.white }}
                      customTextStyle={{ color: colors.primary }}
                    />

                  <CustomButton2
                      onPress={() => {
                        setComfirmationModalOpen(false);
                        handleSendOtp()
                      }}
                      text="Proceed"
                      customStyle={{ width: winDi.width / 3, marginLeft: 10 }}
                    />
                  </View>
                </View>
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
