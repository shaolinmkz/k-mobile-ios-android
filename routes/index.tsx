import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Dimensions, Platform } from "react-native";

import Home from "../screens/Home";
import colors from "../constants/colors";

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
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
      >
        <Stack.Screen
          name="Kwiklli"
          component={Home}
          options={{
            headerTitleStyle: { fontSize: 22, fontFamily: "lato-bold" },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
