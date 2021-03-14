import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Font from "expo-font";
import { enableScreens } from "react-native-screens";

enableScreens();

import Routes from "./routes";
import colors from "./constants/colors";

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
    <View style={styles.container}>
      <Routes />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    width: "100%",
  },
});
