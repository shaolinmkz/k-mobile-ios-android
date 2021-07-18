import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
import store from "./redux";
import colors from "./constants/colors";

enableScreens();

import Routes from "./navigation";

const loadFonts = () => {
  return Font.loadAsync({
    "lato-thin": require("./assets/fonts/Lato-Thin.ttf"),
    "lato-light": require("./assets/fonts/Lato-Light.ttf"),
    "lato-regular": require("./assets/fonts/Lato-Regular.ttf"),
    "lato-bold": require("./assets/fonts/Lato-Bold.ttf"),
  });
};


export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadFonts().finally(() => {
      setLoaded(true);
    });
  }, []);

  return !loaded ? null : (
    <Provider store={store}>
      <View style={styles.container}>
        <Routes />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
});
