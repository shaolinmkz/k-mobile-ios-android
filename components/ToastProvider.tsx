import React, { useEffect, useRef } from "react";
import { useToast, NativeBaseProvider } from "native-base";
import useAppState from "../hooks/useAppState";
import { Dimensions } from "react-native";
import { SET_GLOBAL_ERROR, SET_GLOBAL_SUCCESS } from "../redux/types";

const ToastRender = () => {
  const successRef = useRef();
  const errorRef = useRef();
  const toast = useToast();
  const { globalErrorMessage, globalSuccessMessage, dispatch } = useAppState();

  useEffect(() => {
    if (globalErrorMessage && typeof globalErrorMessage === "string") {
      errorRef.current = toast.show({
        title: "Error",
        description: globalErrorMessage,
        placement: "top",
        duration: 6000,
        width: Dimensions.get("window").width - 10,
        overflow: "hidden",
        onTouchStart: () => toast.close(errorRef.current),
      });
    }

    dispatch({ type: SET_GLOBAL_ERROR, payload: "" });
  }, [globalErrorMessage]);

  useEffect(() => {
    if (globalSuccessMessage && typeof globalSuccessMessage === "string") {
      successRef.current = toast.show({
        title: "Success",
        status: "success",
        description: globalSuccessMessage,
        duration: 5000,
        placement: "top",
        width: Dimensions.get("window").width - 10,
        onTouchStart: () => toast.close(successRef.current),
      });
    }

    dispatch({ type: SET_GLOBAL_SUCCESS, payload: "" });
  }, [globalSuccessMessage]);

  return null;
};

export default ({ children }: any) => {
  return (
    <NativeBaseProvider>
      <ToastRender />
      {children}
    </NativeBaseProvider>
  );
};
