import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton2 from "../components/CustomButton2";
import colors from "../constants/colors";

const availableAccountNumbers = "*"
  .repeat(10)
  .split("*")
  .map((val, index) => ({
    id: `${index + 1}`,
    name: "ADAEZE MOJI IBRAHIM",
    accountNumber: "3204597897",
  }));

const AccountNumberList = () => {
  const [accountNumberId, setAccountNumberId] = useState("");

  const handleCheck = (value: string) => {
    setAccountNumberId(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Account Numbers</Text>
      </View>

      <ScrollView style={styles.list}>
        {availableAccountNumbers.map(({ name, accountNumber, id }) => (
          <CustomRadioButton
            checked={accountNumberId === id}
            text1={name}
            text2={accountNumber}
            key={id}
            onSelect={() => handleCheck(id)}
          />
        ))}
      </ScrollView>
      <View
        style={{
          paddingVertical: 40,
          paddingHorizontal: Dimensions.get("window").width / 15,
        }}
      >
        <CustomButton2
          onPress={() => {}}
          text="Proceed"
          disabled={!accountNumberId}
        />
      </View>
    </View>
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
