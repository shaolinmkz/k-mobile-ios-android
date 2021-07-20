import React, { useEffect } from "react";
import { useToast, NativeBaseProvider } from "native-base";
import useAppState from "../hooks/useAppState";
import { Dimensions } from "react-native";
import { SET_GLOBAL_ERROR, SET_GLOBAL_SUCCESS } from "../redux/types";

const ToastRender = () => {
  const toast = useToast();
  const { globalErrorMessage, globalSuccessMessage, dispatch } = useAppState();

  useEffect(() => {
    if (globalErrorMessage && typeof globalErrorMessage === "string") {
      toast.show({
        title: "Error",
        description: globalErrorMessage,
        placement: "top",
        duration: 5000,
        width: Dimensions.get("window").width - 10,
        overflow: "hidden",
      });
    }

    dispatch({ type: SET_GLOBAL_ERROR, payload: "" });
  }, [globalErrorMessage]);

  useEffect(() => {
    if (globalSuccessMessage && typeof globalSuccessMessage === "string") {
      toast.show({
        title: "Success",
        status: "success",
        description: globalSuccessMessage,
        duration: 5000,
        placement: "top",
        width: Dimensions.get("window").width - 10,
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
