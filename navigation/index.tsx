// @ts-nocheck
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions, Platform } from "react-native";

import Home from "../screens/Home";
import AccountNumberList from "../screens/AccountNumberList";
import colors from "../constants/colors";
import LinkAlias from "../screens/LinkAlias";
import SelectAlias from "../screens/SelectAlias";
import SendMoney from "../screens/SendMoney";
import OtpScreen from "../screens/OtpScreen";
import BankAppSetup from "../screens/BankAppSetup";
import fonts from "../constants/fonts";
import { ternaryResolver } from "../helpers";

const Stack = createStackNavigator();

const headerStyle = {
  backgroundColor: colors.headerBg,
  height: Dimensions.get("screen").height / 9,
};

const headerTitleContainerStyle = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  position: "absolute",
  flexDirection: "row",
  alignItems: "center",
  paddingLeft:
    Dimensions.get("window").width / ternaryResolver(Platform.OS === "android", 15, 30),
};

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BankAppSetup">
        <Stack.Screen
          name="BankAppSetup"
          component={BankAppSetup}
          options={{
            title: "Bank Setup",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 18,
              fontFamily: fonts.bold,
              color: colors.secondary,
            },
            headerStyle,
            headerTitleContainerStyle,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 18,
              fontFamily: fonts.bold,
              color: colors.secondary,
            },
            headerStyle,
            headerTitleContainerStyle,
          }}
        />
        <Stack.Screen
          name="AccountNumberList"
          component={AccountNumberList}
          options={{
            title: "Accounts",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: fonts.bold,
            },
             headerStyle,
          }}
        />
        <Stack.Screen
          name="LinkAlias"
          component={LinkAlias}
          options={{
            title: "Select Alias",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: fonts.bold,
            },
             headerStyle,
          }}
        />

        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{
            title: "One Time Password",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: fonts.bold,
            },
             headerStyle,
          }}
        />

        <Stack.Screen
          name="SelectAlias"
          component={SelectAlias}
          options={{
            title: "Select Alias",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: fonts.bold,
            },
             headerStyle,
          }}
        />

        <Stack.Screen
          name="SendMoney"
          component={SendMoney}
          options={{
            title: "Send Money",
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: fonts.bold,
            },
             headerStyle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
