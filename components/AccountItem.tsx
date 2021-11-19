// @ts-nocheck
import React, { useRef } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import randomColor from "randomcolor";
import colors from "../constants/colors";
import fonts from "../constants/fonts";
import { fallbackResolver, sanitizePhoneNumber } from "../helpers";

interface IAccountItem {
  displayColor?: string;
  initials: string;
  name: string;
  phoneNumbers: string;
  isMultiple?: boolean;
  checked?: boolean;
}

const AccountItem = ({
  displayColor,
  initials,
  name,
  phoneNumbers,
  isMultiple,
  checked,
}: IAccountItem) => {
  const refColor = useRef(randomColor({ luminosity: "dark" }));
  return (
    <View style={styles.account}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width / 7,
              height: Dimensions.get("window").width / 7,
              borderRadius: 100,
              backgroundColor: fallbackResolver(displayColor, refColor.current),
              justifyContent: "center",
              alignItems: "center",
              marginRight: Dimensions.get("window").width / 30,
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontFamily: fonts.regular,
                fontSize: Dimensions.get("window").width / 15,
              }}
            >
              {initials}
            </Text>
          </View>

          {`${name}`.length <= 24 && (
            <View>
              <Text
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.bold,
                  fontSize: Dimensions.get("window").width / 22,
                  textTransform: "capitalize",
                }}
              >
                {name}
              </Text>
              <Text
                style={{
                  color: colors.secondary,
                  fontSize: Dimensions.get("window").width / 22,
                }}
              >
                {sanitizePhoneNumber(phoneNumbers)}
              </Text>
            </View>
          )}

          {`${name}`.length > 24 && (
          <View>
              <Text
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.bold,
                  fontSize: Dimensions.get("window").width / 25,
                  textTransform: "capitalize",
                }}
              >
                {`${name}`.split(" ")[0]}
              </Text>
              <Text
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.bold,
                  fontSize: Dimensions.get("window").width / 25,
                  textTransform: "capitalize",
                }}
              >
                {`${name}`.split(" ")[1]}{" "}{`${name}`.split(" ")[2]}
              </Text>

            <Text
              style={{
                color: colors.secondary,
                marginTop: Dimensions.get("window").height / 300,
                fontSize: Dimensions.get("window").width / 24,
              }}
            >
              {sanitizePhoneNumber(phoneNumbers)}
            </Text>
          </View>
          )}
        </View>

        {isMultiple && (
          <View
            style={{
              backgroundColor: colors.white,
              width: Dimensions.get("window").width / 15,
              height: Dimensions.get("window").width / 15,
              borderRadius: 100,
              borderColor: checked ? colors.primary : colors.border,
              borderWidth: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: checked ? colors.primary : colors.white,
                width: Dimensions.get("window").width / 25,
                height: Dimensions.get("window").width / 25,
                borderRadius: 100,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  account: {
    width: "100%",
    padding: Dimensions.get("window").width / 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    justifyContent: "center",
  },
});

export default AccountItem;
