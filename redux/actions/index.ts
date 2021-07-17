import api from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastError, toastSuccess } from "../../helpers";
import { replace, navigate } from "../../helpers/navigationRef";
import { LOGIN, LOGIN_LOADING, STOP_LOGIN_LOADING } from "../types";


export const loginAction = (dispatch: (data: any) => void) => async (payload: any, selectedBank: any) => {
  dispatch({ type: LOGIN_LOADING });

  try {
    const { data: { data, message } } = await api.post('/users/auth/login', payload);
    toastSuccess(message);

    dispatch({
      type: LOGIN,
      payload: {
        token: data.token,
        userData: data,
      }
    });

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    await AsyncStorage.setItem('selectedBank', JSON.stringify(selectedBank));

    replace("Home");
  }
  catch (error) {
    toastError(error?.response?.data?.message)
  }
  finally {
    dispatch({ type: STOP_LOGIN_LOADING });
  }
};
