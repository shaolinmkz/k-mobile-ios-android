import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { View, Image, Modal, Animated } from "react-native";
import { SET_SPLASH_SCREEN } from "../redux/types";
import useAppState from "../hooks/useAppState";

const SplashScreen = ({ logo, timeout }: React.ComponentProps<any>) => {
  const { splashScreenOpen } = useAppState();
  const dispatch = useDispatch();

  const { current: startValue } = useRef(new Animated.Value(0));

  const handleSplashScreen = (time: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  useEffect(() => {
    if (splashScreenOpen) {
      handleSplashScreen(timeout).finally(() => {
        dispatch({ type: SET_SPLASH_SCREEN, payload: false });
      });
    }
  }, [splashScreenOpen]);

  useEffect(() => {
    Animated.spring(startValue, {
      toValue: -20,
      friction: 1,
      useNativeDriver: true,
    }).start()
  }, []);

  return (
    <Modal animationType="fade" transparent={false} visible style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: startValue,
                },
              ],
            },
          ]}
        >
          <Image
            source={{
              uri: logo,
              width: 100,
              height: 100,
            }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

SplashScreen.defaultProps = {
  timeout: 3000
}

export default SplashScreen;
