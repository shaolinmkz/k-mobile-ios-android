import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import LinkInfoModal from "../components/LinkInfoModal";
import useAppState from "../hooks/useAppState";
import useNavJourney from "../hooks/useNavJourney";
import { IAccount } from "../Interfaces";
import { fetchUserIdLinkedToBVNAction } from "../redux/actions";
import { INDEPENDENT_UNLINKING } from "../constants/actions";

const AccountNumberList = ({
  navigation,
  route,
}: React.ComponentProps<any>) => {
  const { userExist, accountNumber, senderFullName, dispatch } = useAppState();
  const action = route?.params?.action;

  const { activeJourney } = useNavJourney({ action });

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<IAccount>({
    senderFullName: "",
    accountNumber: "",
  });

  const handleCheck = (value: IAccount) => {
    setSelectedAccount(value);
  };

  const handleModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchUserIdLinkedToBVNAction(dispatch);
  }, [])

  if (userExist === false && userExist !== null && isModalOpen && activeJourney?.activeAction !== INDEPENDENT_UNLINKING) {
    return (
      <>
        <LinkInfoModal mode="dark" visible handleModal={handleModal} />
      </>
    );
  } else {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {activeJourney?.text}
            </Text>
          </View>

          <ScrollView style={styles.list}>
            <CustomRadioButton
              checked={selectedAccount.accountNumber === accountNumber}
              text1={`${senderFullName}`.toUpperCase()}
              text2={`${accountNumber}`}
              key={accountNumber}
              onSelect={() => handleCheck({ senderFullName, accountNumber })}
            />
          </ScrollView>
          <View
            style={{
              paddingVertical: Dimensions.get("window").width / 10,
              paddingHorizontal: Dimensions.get("window").width / 15,
            }}
          >
            <CustomButton2
              onPress={() => {
                navigation.navigate({
                  name: activeJourney?.nextScreen,
                  params: {
                    account: selectedAccount,
                    action,
                  },
                });
              }}
              text="Proceed"
              disabled={!selectedAccount.accountNumber}
            />
          </View>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  list: {
    paddingHorizontal: Dimensions.get("window").width / 15,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "lato-regular",
  },
});

export default AccountNumberList;
