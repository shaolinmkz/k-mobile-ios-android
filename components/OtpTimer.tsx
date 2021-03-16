// @ts-nocheck
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Fontisto } from '@expo/vector-icons'
import { timerConverter, anonymousFunc } from "../helpers";
import colors from "../constants/colors";

interface ComponentProp {
  duration?: number;
  callback?: () => void;
  secondTick?: number;
  isFinished?: boolean;
}

const OtpTimer = ({
  duration,
  callback,
  secondTick,
  isFinished,
}: ComponentProp) => {
  const initialState = {
    state: () => {
      const minute = duration / 1000 / 60 >= 60 ? 60 : duration / 1000 / 60;
      return {
        min: minute > 1 ? minute - 1 : 0,
        sec: minute > 1 ? 59 : duration / 1000,
        counter: duration,
        percentage: "100%",
        finished: isFinished,
        counterIntervalRef: null,
      };
    },
  };
  const [state, setState] = useState(initialState.state);

  const { min, sec, percentage, finished } = state;

  /**
   * @function handleCallback
   * @description calls the callback prop function
   * @returns {void}
   */
  const handleCallback = () => {
    callback();
    setState(initialState.state);
  };

  /**
   * @function handleConditionalTimer
   * @description calls timer function
   * @returns {void}
   */
  const handleConditionalTimer = useCallback(() => {
    if (min === "00" && sec === "00") {
      setState((prevState) => ({
        ...prevState,
        finished: true,
        counterIntervalRef: clearInterval(prevState.counterIntervalRef),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        min: timerConverter.min(+prevState.min, +prevState.sec),
        sec: timerConverter.sec(+prevState.min, +prevState.sec),
        counter: prevState.counter - 1000,
        percentage: `${((prevState.counter - 1000) / duration) * 100}%`,
      }));
    }
  }, [duration, min, sec]);

  useEffect(() => {
    const counterIntervalRef = setInterval(handleConditionalTimer, secondTick);
    setState((prevState) => ({
      ...prevState,
      counterIntervalRef,
    }));
    return () => clearInterval(counterIntervalRef);
  }, [min, sec, duration, secondTick, handleConditionalTimer]);

  return (
    <View style={styles.otpTimer}>
      <View style={{ width: "100%", alignItems: 'flex-end' }}>
        {!finished && (
          <Text
            style={{ fontSize: 15, color: colors.textColor, fontFamily: 'lato-regular' }}
          >{`Resend OTP (${min}:${sec})`}</Text>
        )}
        {finished && (
          <TouchableOpacity onPress={handleCallback} style={{ flexDirection: 'row', alignItems: 'center'}}>
             <Fontisto name="redo" size={15} color={colors.primary} style={{ marginRight: 5 }} />
            <Text style={{ color: colors.primary, fontFamily: "lato-bold", fontSize: 15 }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!finished && (
        <View
          style={{
            width: "100%",
            marginVertical: 10,
            position: "relative",
            height: 10,
            overflow: "hidden",
            borderRadius: 8,
            backgroundColor: "rgba(175, 79, 79, 0.1)",
          }}
        >
          <View
            style={{
              width: percentage,
              position: "absolute",
              height: "100%",
              backgroundColor: colors.primary,
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  otpTimer: {
    width: "100%",
    marginBottom: 20,
  },
});

OtpTimer.defaultProps = {
  callback: anonymousFunc,
  duration: 60000, // defaults to 1 minute if nothing is passed
  secondTick: 1000, // defaults to 1 second if nothing is passed
  isFinished: false,
};

export default OtpTimer;
