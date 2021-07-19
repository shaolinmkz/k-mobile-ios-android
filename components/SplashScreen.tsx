import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { View, Image, Modal } from "react-native";
import { SET_SPLASH_SCREEN } from "../redux/types";
import useAppState from "../hooks/useAppState";

const SplashScreen = ({ logo }: React.ComponentProps<any>) => {
  const { splashScreenOpen } = useAppState();
  const dispatch = useDispatch();

  const handleSplashScreen = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    })
  }

  useEffect(() => {
    if(splashScreenOpen) {
      handleSplashScreen(2000).finally(() => {
        dispatch({ type: SET_SPLASH_SCREEN, payload: false })
      });
    }
  }, [splashScreenOpen]);

  return (
    <Modal animationType="none" transparent={false} visible style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{
            uri: logo,
            width: 100,
            height: 100,
          }}
        />
      </View>
    </Modal>
  );
};

export default SplashScreen;
