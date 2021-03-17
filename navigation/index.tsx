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

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 18,
              fontFamily: "lato-bold",
              color: colors.secondary
            },
            headerTitleContainerStyle:
              Platform.OS === "android"
                ? {
                    backgroundColor: colors.headerBg,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    position: "absolute",
                    justifyContent: "center",
                    paddingLeft: Dimensions.get("window").width / 15,
                  }
                : {},
          }}
        />
        <Stack.Screen
          name="AccountNumberList"
          component={AccountNumberList}
          options={{
            title: 'Accounts',
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: "lato-bold",
            },
            headerTitleContainerStyle: {},
          }}
        />
        <Stack.Screen
          name="LinkAlias"
          component={LinkAlias}
          options={{
            title: 'Select Alias',
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: "lato-bold",
            },
            headerTitleContainerStyle: {},
          }}
        />

        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{
            title: 'One Time Password',
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: "lato-bold",
            },
            headerTitleContainerStyle: {},
          }}
        />

        <Stack.Screen
          name="SelectAlias"
          component={SelectAlias}
          options={{
            title: 'Select Alias',
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: "lato-bold",
            },
            headerTitleContainerStyle: {},
          }}
        />

        <Stack.Screen
          name="SendMoney"
          component={SendMoney}
          options={{
            title: 'Send to Alias',
            headerTitleStyle: {
              fontSize: Dimensions.get("window").width / 20,
              fontFamily: "lato-bold",
            },
            headerTitleContainerStyle: {},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
