import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DispatchRef } from "../helpers/navigationRef";
import { LOGOUT } from "../redux/types";


const customAxios = axios.create({
  baseURL: "https://api-npay.bluegreensoft.com/v1",
});

const clearStorageAndLogout = async () => {
  try {
    await AsyncStorage.clear();
    DispatchRef.dispatch({ type: LOGOUT });
  } catch (e) {
    return e;
  }
}


/**
 * Interceptor construct
 */
customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    try {
      const isAuth = err?.config?.url?.includes?.("auth");
      const statusCode = err?.response?.status;
      if (statusCode === 401 && !isAuth) {
        clearStorageAndLogout();
      }
      return Promise.reject(err);
    } catch (cbErr) {
      return Promise.reject(cbErr);
    }
  }
);


export default customAxios;
