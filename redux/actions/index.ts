import kwiklliApi from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { findTelco, isValidPhoneNumber, ternaryResolver, toastError, toastSuccess } from "../../helpers";
import { replace, navigate } from "../../helpers/navigationRef";
import {
  LOGIN,
  LOGIN_LOADING,
  STOP_LOGIN_LOADING,
  SET_LINKED_ALIASES,
  VALIDATING_PHONE_NUMBER,
  VALIDATED_PHONE_NUMBER,
  VALIDATED_OPTIONS_PHONE_NUMBER,
  SET_PAGE_LOADING,
  SET_USER_EXIST,
  SET_ACTION_LOADING,
  SET_LINK_SUCCESSFUL,
  RESET_OTP_FIELDS,
  SET_UNLINK_SUCCESSFUL,
  SET_TRANSFER_SUCCESSFUL,
  SET_MAX_TRANSFER_AMOUNT,
  SET_REVERSAL_DURATION,
  LOGOUT,
  SET_SPLASH_SCREEN,
} from "../types";
import { IInitialState } from "../../Interfaces";
import { telcoPrefixes } from "../../helpers/phoneNumberPrefixes";
import { initialState } from "../reducers/appReducer";

const getApiAndToken = async (): Promise<IInitialState> => {
  try {
    const token = await AsyncStorage.getItem('token');
    const selectedBank = await AsyncStorage.getItem('selectedBank');
    const appState = await AsyncStorage.getItem('appState');

    if (token && selectedBank && appState) {
      return {
        ...JSON.parse(appState),
        token,
        appKey: JSON.parse(appState)?.selectedBank?.apiKey || JSON.parse(selectedBank)?.apiKey,
      }
    } else {
      throw Error();
    }
  }
  catch (error) {
    return initialState;
  }
}


export const loginAction = (dispatch: (data: any) => void) => async (payload: any, selectedBank: any) => {
  dispatch({ type: LOGIN_LOADING });

  try {
    const { data: { data, message } } = await kwiklliApi.post('/users/auth/login', payload);
    toastSuccess(message, dispatch);

    dispatch({
      type: LOGIN,
      payload: {
        token: data.token,
        userData: data,
      }
    });

    dispatch({ type: SET_SPLASH_SCREEN, payload: true });

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data));
    await AsyncStorage.setItem('selectedBank', JSON.stringify(selectedBank));

    replace("Home");
    return true;
  }
  catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: STOP_LOGIN_LOADING });
  }
};

export const logoutAction = async (dispatch: (data: any) => void) => {
  await AsyncStorage.clear();
  replace("BankAppSetup");
  dispatch({ type: LOGOUT });
}

export const fetchUserIdLinkedToBVNAction = async (dispatch: (data: any) => void) => {
  try {
    const { appKey, selectedBank, bvn } = await getApiAndToken();
    const { data: { data: linkedAliases } } = await kwiklliApi
      .get(`/banks/alias/numbers/${selectedBank?.bankCode}?bvn=${bvn}&limit=100`,
        {
          headers: {
            appKey,
          },
        }
      )

    dispatch({ type: SET_LINKED_ALIASES, payload: linkedAliases })
  }
  catch (error) {
    return error;
  }
};

export const validatePhoneNumber = (dispatch: (data: any) => void) => async (value: string) => {

  try {
    dispatch({ type: VALIDATING_PHONE_NUMBER, payload: true });

    const { appKey, token, selectedBank } = await getApiAndToken();

    const userId = ternaryResolver(
      isValidPhoneNumber(value),
      `234${value.slice(1)}`,
      value
    );

    const customErrorMessage =
      "We are unable to validate this phone number (or email address). Kindly confirm that the phone number (or email address) is correct before you complete the transfer";

    const { data: { data } } = await kwiklliApi.get(`/kyc/phone_number?phone_number=${userId}&bankCode=${selectedBank?.bankCode}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        appKey,
      },
    });

    if (data?.accountName && !Array.isArray(data?.accountName)) {
      dispatch({
        type: VALIDATED_PHONE_NUMBER,
        payload: data.accountName.trim().replace(/undefined/gim, ""),
      });

    } else if (data?.accountName && Array.isArray(data?.accountName)) {
      dispatch({
        type: VALIDATED_OPTIONS_PHONE_NUMBER,
        payload: data.accountName.map((val: any) => val.trim().replace(/undefined/gim, "")),
      });
    }

    if (!data.accountName) {
      toastError(customErrorMessage, dispatch);
    }
  }
  catch (error) {
    return error
  } finally {
    dispatch({ type: VALIDATING_PHONE_NUMBER, payload: false });
  }
};

export const handleVerifyUser = (dispatch: (data: any) => void, loading = true) => async () => {

  try {
    if(loading) {
      dispatch({ type: SET_PAGE_LOADING, payload: true });
    }

    const { accountNumber, appKey, bvn, selectedBank } = await getApiAndToken();
    const payload = {
      accountNumber,
      bankCode: selectedBank?.bankCode,
      bvn,
    };

    const { data: { data } } = await kwiklliApi
      .post('/banks/enroll-user', payload, {
        headers: {
          appKey,
        },
      });

    fetchUserIdLinkedToBVNAction(dispatch); // fetches users linked aliases
    dispatch({ type: SET_USER_EXIST, payload: data?.userExist });

  }
  catch (error) {
    dispatch({ type: SET_USER_EXIST, payload: null });
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: SET_PAGE_LOADING, payload: false });
  }
};

export const initiateUnlink = (dispatch: (data: any) => void, resend = false) => async ({ userId }: any) => {

  try {
    if (!resend) {
      dispatch({ type: SET_ACTION_LOADING, payload: true })
    }

    const { appKey, selectedBank } = await getApiAndToken();

    const payload = {
      userId,
      bankCode: selectedBank?.bankCode,
    };

    await kwiklliApi
      .post('/banks/unlink/account/otp', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(`OTP sent to ${payload.userId}`, dispatch);

    return true;
  }
  catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const confirmUnlink = (dispatch: (data: any) => void) => async ({ userId, otp }: any) => {

  try {
    const { appKey, selectedBank } = await getApiAndToken();

    const payload = {
      userId,
      otp: Object.values(otp).join(""),
      bankCode: selectedBank?.bankCode,
    };

    dispatch({ type: SET_ACTION_LOADING, payload: true });

    await kwiklliApi
      .post('/banks/activate/unlink/account', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(`${payload.userId} has been unlinked successfully`, dispatch);
    dispatch({ type: SET_UNLINK_SUCCESSFUL, payload: true })
    handleVerifyUser(dispatch)();
    fetchUserIdLinkedToBVNAction(dispatch);
    return true;
  }
  catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const initiateIndependentLinking = (dispatch: (data: any) => void, resend = false) => async ({ userId }: any) => {
  try {
    const { accountNumber, appKey, selectedBank } = await getApiAndToken();

    const payload = {
      accountNumber: accountNumber,
      bankCode: selectedBank?.bankCode,
      phoneNumber: userId,
    };

    if (resend === false) {
      dispatch({ type: SET_ACTION_LOADING, payload: true });
    }

    const { data: { message } } = await kwiklliApi
      .post('/banks/link-account-otp', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message, dispatch);
    return true;
  } catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const confirmIndependentLinking = (dispatch: (data: any) => void) => async ({ userId, otp }: any) => {
  try {
    dispatch({ type: SET_ACTION_LOADING, payload: true });

    const { senderFullName, appKey, bvn, selectedBank } = await getApiAndToken();

    const payload = {
      phoneNumber: userId,
      otp: Object.values(otp).join(""),
      accountName: senderFullName,
      bankCode: selectedBank?.bankCode,
      bvn,
    };

    const { data: { message } } = await kwiklliApi
      .post('/banks/link-account', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message, dispatch);
    dispatch({ type: RESET_OTP_FIELDS });
    dispatch({ type: SET_LINK_SUCCESSFUL, payload: true });
    handleVerifyUser(dispatch)();
    return true;
  } catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

/**
 * Initial Linking (When a user wants to send money and is not enrolled yet)
 *
 **/
export const initiateInitialLinking = (dispatch: (data: any) => void, resend = false) => async () => {
  try {
    const { phoneNumber, accountNumber, appKey, selectedBank } = await getApiAndToken();

    const payload = {
      accountNumber,
      bankCode: selectedBank?.bankCode,
      phoneNumber,
    };

    if(!resend) {
      dispatch({ type: SET_ACTION_LOADING, payload: true });
    }

    await kwiklliApi
      .post('/banks/link-status', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(`OTP sent to ${phoneNumber}`, dispatch);
    return true;
  }
  catch (error) {
    toastError(error?.response?.data?.message, dispatch)
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const confirmInitialLinking = (dispatch: (data: any) => void) => async ({ otp }: any) => {
  try {
    const { phoneNumber, senderFullName, bvn, appKey, selectedBank } = await getApiAndToken();

    const payload = {
      phoneNumber,
      otp: Object.values(otp).join(""),
      bankCode: selectedBank?.bankCode,
      bvn,
      accountName: senderFullName,
    };

    dispatch({ type: SET_ACTION_LOADING, payload: true });

    const { data: { message } } = await kwiklliApi
      .post('/banks/activate/link-status', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message, dispatch);
    dispatch({ type: SET_LINK_SUCCESSFUL, payload: true });
    handleVerifyUser(dispatch)();
    return true;
  } catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  } finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};


export const handleTransfer = (dispatch: (data: any) => void) => async ({ amount, receiverId }: any) => {
  try {
    const { accountNumber, senderFullName, appKey, selectedBank } = await getApiAndToken();

    const payload = {
      senderAccountNumber: accountNumber,
      originBankCode: selectedBank?.bankCode,
      amount: Number(amount) * 100,
      receiverId,
      paymentChannel: "MOBILE_APP",
      telcoName: findTelco(receiverId, telcoPrefixes)?.toUpperCase?.() || "N/A",
      senderFullName,
    };

    dispatch({ type: SET_ACTION_LOADING, payload: true });

    const { data } = await kwiklliApi
      .post('/banks/transactions/transfer/bank_kwiklli', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(data?.message, dispatch);
    dispatch({ type: SET_TRANSFER_SUCCESSFUL, payload: true });
  }
  catch (error) {
    toastError(error?.response?.data?.message, dispatch);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const handleFetchMaxTransferAmount = async (dispatch: (data: any) => void) => {
  try {
    const { token } = await getApiAndToken();
    const { data: { data } } = await kwiklliApi
      .get('/transactions/maximum-transfer-amount', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    dispatch({ type: SET_MAX_TRANSFER_AMOUNT, payload: Number(data?.value) / 100 });
  }
  catch (error) {
    dispatch({ type: SET_MAX_TRANSFER_AMOUNT, payload: "0" });
  }
};

/**
 * Gets the reversal duration for a transaction
 */
export const handleFetchReversalDuration = async (dispatch: (data: any) => void) => {
  try {
    const { token } = await getApiAndToken();

    const { data: { data } } = await kwiklliApi
      .get('/transactions/reversal-time', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    dispatch({ type: SET_REVERSAL_DURATION, payload: data?.value });

  }
  catch (error) {
    dispatch({ type: SET_REVERSAL_DURATION, payload: "0" });
  }
};
