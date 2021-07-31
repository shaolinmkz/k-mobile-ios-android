import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { replace, DispatchRef } from "../helpers/navigationRef";
import { LOGOUT } from "../redux/types";

const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    replace("BankAppSetup");
    DispatchRef.dispatch({ type: LOGOUT });
  } catch (e) {
    return e;
  }
}

/**
 * Interceptor construct
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    try {
      const isAuth = err?.config?.url?.includes?.("auth");
      const statusCode = err?.response?.status;
      if (statusCode === 401 && !isAuth) {
        clearStorage();
      }
      return Promise.reject(err);
    } catch (cbErr) {
      return Promise.reject(cbErr);
    }
  }
);

export default axios.create({
  baseURL: "https://api-npay.bluegreensoft.com/v1",
});
