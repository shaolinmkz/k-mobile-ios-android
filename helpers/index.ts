import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import * as LocalAuthentication from 'expo-local-authentication';
import { APP_STATE_UPDATE, SET_GLOBAL_ERROR, SET_GLOBAL_SUCCESS } from "../redux/types";
import { phonePrefix as phoneNumberPrefix, telcoPrefixes } from "./phoneNumberPrefixes";
export { navigate } from "./navigationRef";

export const anonymousFunc = (data: any) => data;

/**
 * @function timerConverter
 * @description formats milliseconds into a (minute : seconds) timer clock
 */
export const timerConverter = {
  sec: (minuteValue: string, secondsValue: number) => {
    if (minuteValue === "00") {
      return "00";
    }
    if (secondsValue <= 10) {
      return secondsValue === 0 ? 60 : `0${secondsValue - 1}`;
    }
    return `${secondsValue - 1}`;
  },
  min: (minuteValue: number, secondsValue: number) => {
    if (secondsValue <= 0) {
      return minuteValue - 1 || "00";
    }
    if (minuteValue <= 10) {
      return `0${minuteValue}`;
    }
    return `${minuteValue}`;
  },
};

export const ternaryResolver = (
  resolvedExpression: any,
  truthyValue: any,
  falsyValue: any,
) => {
  return resolvedExpression ? truthyValue : falsyValue;
};

export const fallbackResolver = (actualValue: any, fallbackValue: any) => {
  return actualValue || fallbackValue;
};

export const isValidEmail = (email: any) => {
  const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return pattern.test(email);
};

export const delayExecution = {
  debounce: (callback: () => void, delay = 5000) => setTimeout(callback, delay),
};

export const currencyConverter = {
  toNaira: (amount: (number | string)) => {
    amount = Number(amount);

    return amount.toLocaleString('en-NG', {
      style: "currency",
      currency: 'NGN',
    })
  },
  strip: (value: (string | number)) => `${value}`
    .split("")
    .filter((val) => Number.isInteger(+`${val}`) && val !== " ")
    .join(""),
};

export const findTelco = (phoneNumber: string, telcos = telcoPrefixes) => {
  return telcos.find(
    ({ prefix }) => prefix === `${phoneNumber}`.slice(0, prefix.length)
  )?.name;
};

export const isValidAlphabet = (text: any) => /^[a-zA-Z -]*$/.test(text);

export const isValidPhoneNumber = (value: any) => {

  value = value?.replace(/\s/gm, '')

  if (`${value}`.slice(0, 4) === '+234') {
    value = `0${`${value}`.slice(4)}`
  } else if (`${value}`.slice(0, 3) === '234') {
    value = `0${`${value}`.slice(3)}`
  }

  return !!phoneNumberPrefix.find(
    (prefix) => prefix === `${value}`.slice(0, prefix.length)
  ) &&
    `${value}`.length === 11 &&
    /^[0-9]*$/.test(value);
};

export const sanitizePhoneNumber = (value: any) => {
  if (`${value}`.slice(0, 4) === '+234') {
    value = `0${`${value}`.slice(4)}`
  } else if (`${value}`.slice(0, 3) === '234') {
    value = `0${`${value}`.slice(3)}`
  }

  return value.replace(/\s/gm, '')
}

/**
 * @function combinedValidators
 * @description combines different validatiors used in the app
 */
export const combinedValidators = {
  phoneAndEmail: (value: any) => {
    return !(
      (!isValidEmail(value) &&
        !/^[0-9]*$/.test(value) &&
        `${value}`.length !== 11) ||
      (/^[0-9]*$/.test(value) && !isValidPhoneNumber(value)) ||
      (!Number.isInteger(+`${value}`) && !isValidEmail(value))
    )
  }
};

const MAX_TIME = 5000;

interface IAction { type: string, payload: any };

const clearNotification = ({ dispatch, timeout }: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      dispatch({ type: SET_GLOBAL_SUCCESS, payload: "" });
      dispatch({ type: SET_GLOBAL_ERROR, payload: "" });
      resolve(true);
    }, timeout);
  })
};

export const toastError = (message: string, dispatch: (action: IAction) => void, timeout = MAX_TIME) => {
  dispatch({ type: SET_GLOBAL_ERROR, payload: message });

  return clearNotification({ dispatch, timeout });
};

export const toastSuccess = (message: string, dispatch: (action: IAction) => void, timeout = MAX_TIME) => {
  dispatch({ type: SET_GLOBAL_SUCCESS, payload: message });

  return clearNotification({ dispatch, timeout });
}

export const showError = (...values: any) => {
  return values.map((value: any) => Boolean(value)).includes(true);
}

export const validateImageUrl = (value: string) => {
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/gm.test(`${value}`);
}

export const validateToken = async (token: any) => {
  try {
    const currentTimeInSeconds = Date.now();
    const expirationTimeInSeconds = jwt_decode<any>(token)?.exp * 1000;
    return expirationTimeInSeconds > currentTimeInSeconds;
  } catch (err) {
    return false;
  }
}

export const isAuthenticated = async (dispatch: (data: any) => void) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const prevAppState = await AsyncStorage.getItem("appState");
    const authenticated = await validateToken(token);

    if (authenticated) {
      if (prevAppState) {
        dispatch({
          type: APP_STATE_UPDATE,
          payload: JSON.parse(prevAppState),
        });
      }
    }
    return authenticated;
  } catch (e) {
    return false;
  }
};

interface IHardwareAuth {
  dispatch?: (data: any) => void;
  promptMessage?: string;
}

export const authenticateUserViaHardware = async ({ dispatch, promptMessage }: IHardwareAuth) => {


    const cancelAuthFlow = () => {
      if(Platform.OS === "android") {
        LocalAuthentication.cancelAuthenticate();
      }
    }


  try {
    const hashardWare = await LocalAuthentication.hasHardwareAsync();
    if(hashardWare) {
     // What type of auth is available
     // 1 - reps finger print ID
     // 2 - reps facial ID
     // [1, 2] - reps both finger and faicial ID
     const supportAuth = await LocalAuthentication.supportedAuthenticationTypesAsync();
     const supportsFingerPrintAuth = Array.isArray(supportAuth) && supportAuth.includes(1);

     if(supportsFingerPrintAuth) {
       // has device saved auth data for use
       const isEnrolled = await LocalAuthentication.isEnrolledAsync();

       if(isEnrolled) {
         const customPromptMessage = fallbackResolver(promptMessage, "Biometric Confirmation");

         const authenicated = await LocalAuthentication.authenticateAsync({
          promptMessage: customPromptMessage,
          cancelLabel: "Cancel",
          disableDeviceFallback: true,
         });

         if(!authenicated.success) {
          cancelAuthFlow();
           // @ts-ignore
           throw Error(fallbackResolver(ternaryResolver(`${authenicated?.message}`.toLowerCase() === "cancel", `${promptMessage} Failed`, authenicated?.message), "Oops! Authentication Failed..."));
         }

         dispatch?.({ type: SET_GLOBAL_SUCCESS, payload: "Authentication Passed..." });
         return authenicated;
       }
        return false;
     }
     return false;
    }
  } catch (error) {
    dispatch?.({ type: SET_GLOBAL_ERROR, payload: error?.message });
    return false;
  }
}
