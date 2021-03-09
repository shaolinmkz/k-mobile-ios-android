import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../screens/Home";

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
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
