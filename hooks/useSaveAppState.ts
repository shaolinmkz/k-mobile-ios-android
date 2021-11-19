import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated } from "../helpers";
import { IAppState, IInitialState } from "../Interfaces";


const useSaveAppState = () => {
  const dispatch = useDispatch();

  const appState: IInitialState = useSelector(
    (state: IAppState) => state.appState
  );

  const {
    senderFullName,
    accountNumber,
    bvn,
    phoneNumber,
    selectedBank,
  } = appState;

  const saveAppState = async (state: IInitialState) => {
    try {
      await AsyncStorage.setItem("appState", JSON.stringify(state));
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    isAuthenticated(dispatch).then((isAuth) => {
      if (!isAuth) {
        saveAppState(appState);
      }
    });
  }, [accountNumber, bvn, phoneNumber, selectedBank, senderFullName]);
}

export default useSaveAppState;
