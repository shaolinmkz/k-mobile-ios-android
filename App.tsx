import React from "react";
import { StyleSheet, View } from "react-native";
import Apploading from "expo-app-loading";
import { useFonts } from "expo-font";

import Routes from "./routes";
import colors from './constants/colors';

export default function App() {
  const [loaded] = useFonts({
    "lato-thin": require("./assets/fonts/Lato-Thin.ttf"),
    "lato-light": require("./assets/fonts/Lato-Light.ttf"),
    "lato-regular": require("./assets/fonts/Lato-Regular.ttf"),
    "lato-bold": require("./assets/fonts/Lato-Bold.ttf"),
  });

  return !loaded ? (
    <Apploading />
  ) : (
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
