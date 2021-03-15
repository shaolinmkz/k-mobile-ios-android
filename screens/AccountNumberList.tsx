import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
} from "react-native";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";
import LinkInfoModal from "../components/LinkInfoModal";

const availableAccountNumbers = "*"
  .repeat(10)
  .split("*")
  .map((val, index) => ({
    id: `${index + 1}`,
    name: `ADAEZE MOJI IBRAHIM ${index + 1}`,
    accountNumber: `320459789${index}`,
  }));

interface Account {
  id: string;
  name: string;
  accountNumber: string;
}

const AccountNumberList = ({ navigation, route }: React.ComponentProps<any>) => {
  const [isFirstTime, setIsFirstTime] = useState(route.params.isFirstTime);
  const [selectedAccount, setSelectedAccount] = useState({
    id: "",
    name: "",
    accountNumber: "",
  });

  const handleCheck = (value: Account) => {
    setSelectedAccount(value);
  };

  const handleIsFirstTime = () => {
    setIsFirstTime(false);
  };

  return (
    <>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Account Numbers</Text>
      </View>

      <ScrollView style={styles.list}>
        {availableAccountNumbers.map(({ name, accountNumber, id }) => (
          <CustomRadioButton
            checked={selectedAccount.id === id}
            text1={name}
            text2={accountNumber}
            key={id}
            onSelect={() => handleCheck({ name, accountNumber, id })}
          />
        ))}
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
              name: 'SelectAlias',
              params: {
                account: selectedAccount
              }
            })
          }}
          text="Proceed"
          disabled={!selectedAccount.id}
        />
      </View>
    </View>
    <LinkInfoModal mode="dark" visible={isFirstTime} handleModal={handleIsFirstTime} />
    </>
  );
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
