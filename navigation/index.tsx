import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Dimensions, Platform } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import Home from "../screens/Home";
import AccountNumberList from "../screens/AccountNumberList";
import colors from "../constants/colors";
import LinkAlias from "../screens/LinkAlias";
import SelectAlias from "../screens/SelectAlias";
import UnlinkAlias from "../screens/UnlinkAlias";
import SendMoney from "../screens/SendMoney";
import OtpScreen from "../screens/OtpScreen";
import BankAppSetup from "../screens/BankAppSetup";

import HocNavRefSetter from "../components/HocNavRefSetter";
import CustomHeaderButton from "../components/CustomHeaderBtn";

import fonts from "../constants/fonts";
import { fallbackResolver, ternaryResolver } from "../helpers";
import { navigationRef } from "../helpers/navigationRef";
import useAppState from "../hooks/useAppState";
import { SET_LOGOUT_MODAL } from "../redux/types";

const Stack = createStackNavigator();

const components = {
  BankAppSetup: (props: any) => (
    <HocNavRefSetter {...props} component={BankAppSetup} />
  ),
  Home: (props: any) => <HocNavRefSetter {...props} component={Home} />,
  AccountNumberList: (props: any) => (
    <HocNavRefSetter {...props} component={AccountNumberList} />
  ),
  LinkAlias: (props: any) => (
    <HocNavRefSetter {...props} component={LinkAlias} />
  ),
  OtpScreen: (props: any) => (
    <HocNavRefSetter {...props} component={OtpScreen} />
  ),
  SelectAlias: (props: any) => (
    <HocNavRefSetter {...props} component={SelectAlias} />
  ),
  UnlinkAlias: (props: any) => (
    <HocNavRefSetter {...props} component={UnlinkAlias} />
  ),
  SendMoney: (props: any) => (
    <HocNavRefSetter {...props} component={SendMoney} />
  ),
};

const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS,
};

const Routes = () => {
  const { dispatch, selectedBank, authenticated } = useAppState();

  const headerStyle = {
    backgroundColor: colors.headerBg,
    height: Dimensions.get("screen").height / 9,
  };

  const commonHeaderStyles = {
    headerBackTitle: "",
    headerTintColor: colors.secondary,
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
      Dimensions.get("window").width /
      ternaryResolver(Platform.OS === "android", 15, 30),
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {!authenticated ? (
          <Stack.Screen
            name="BankAppSetup"
            component={components.BankAppSetup}
            options={{
              title: "Login",
              headerTitleStyle: {
                fontSize: Dimensions.get("window").width / 18,
                fontFamily: fonts.bold,
                color: colors.secondary,
              },
              ...commonHeaderStyles,
              headerStyle,
              // @ts-ignore
              headerTitleContainerStyle,
              ...TransitionScreenOptions,
              animationTypeForReplace: authenticated ? 'push' : 'pop',
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={components.Home}
              options={{
                title: fallbackResolver(selectedBank?.label, "Home"),
                headerRight: () => (
                  <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                      title="Cart"
                      iconName={
                        Platform.OS === "android"
                          ? "md-exit-outline"
                          : "ios-exit-outline"
                      }
                      onPress={() => {
                        dispatch({ type: SET_LOGOUT_MODAL, payload: true });
                      }}
                    />
                  </HeaderButtons>
                ),
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 18,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerStyle,
                // @ts-ignore
                headerTitleContainerStyle,
                ...TransitionScreenOptions,
              }}
            />
            <Stack.Screen
              name="AccountNumberList"
              component={components.AccountNumberList}
              options={{
                title: "Accounts",
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 20,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerTintColor: colors.secondary,
                headerStyle,
                ...TransitionScreenOptions,
              }}
            />
            <Stack.Screen
              name="LinkAlias"
              component={components.LinkAlias}
              options={{
                title: "Select Alias",
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 20,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerStyle,
                ...TransitionScreenOptions,
              }}
            />

            <Stack.Screen
              name="OtpScreen"
              component={components.OtpScreen}
              options={{
                title: "One Time Password",
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 20,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerStyle,
                ...TransitionScreenOptions,
              }}
            />

            <Stack.Screen
              name="SelectAlias"
              component={components.SelectAlias}
              options={{
                title: "Select Alias",
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 20,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerStyle,
                ...TransitionScreenOptions,
              }}
            />

            <Stack.Screen
              name="UnlinkAlias"
              component={components.UnlinkAlias}
              options={{
                title: "Unlink Alias",
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 20,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerStyle,
                ...TransitionScreenOptions,
              }}
            />

            <Stack.Screen
              name="SendMoney"
              component={components.SendMoney}
              options={{
                title: "Send Money",
                headerTitleStyle: {
                  fontSize: Dimensions.get("window").width / 20,
                  fontFamily: fonts.bold,
                  color: colors.secondary,
                },
                ...commonHeaderStyles,
                headerStyle,
                ...TransitionScreenOptions,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
