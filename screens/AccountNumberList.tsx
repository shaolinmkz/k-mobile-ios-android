import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import LinkInfoModal from "../components/LinkInfoModal";
import useAppState from "../hooks/useAppState";
import { resolveActions } from "../constants/actions";

interface IAccount {
  senderFullName: any;
  accountNumber: any;
}

const AccountNumberList = ({
  navigation,
  route,
}: React.ComponentProps<any>) => {
  const { userExist, accountNumber, senderFullName } = useAppState();

  const actions = resolveActions(route?.params?.action);
  const isLinking = actions.isInitialLinking || actions.isInitialLinking;

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

  if (!userExist && isModalOpen) {
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
              {isLinking ? "Select account to link" : "Select account to debit"}
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
                  name: isLinking ? "LinkAlias" : "SelectAlias",
                  params: {
                    account: selectedAccount,
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
