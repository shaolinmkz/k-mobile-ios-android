import api from "../../api";
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
} from "../types";
import { IInitialState } from "../../Interfaces";
import { telcoPrefixes } from "../../helpers/phoneNumberPrefixes";

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
    return {
      token: "",
      appKey: ""
    }
  }
}


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

export const logoutAction = async (dispatch: (data: any) => void) => {
  await AsyncStorage.clear();
  dispatch({ type: LOGOUT });
  replace("BankAppSetup");
}

export const fetchUserIdLinkedToBVNAction = (dispatch: (data: any) => void) => async (payload: any) => {
  try {
    const { appKey } = await getApiAndToken();
    const { data: { data: linkedAliases } } = await api
      .get(`/banks/alias/numbers/${payload.bankCode}?bvn=${payload.bvn}&limit=100`,
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

    const { appKey, token } = await getApiAndToken();

    const userId = ternaryResolver(
      isValidPhoneNumber(value),
      `234${value.slice(1)}`,
      value
    );

    const customErrorMessage =
      "We are unable to validate this phone number (or email address). Kindly confirm that the phone number (or email address) is correct before you complete the transfer";

    const { data: { data } } = await api.get(`/kyc/phone_number?phone_number=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        appKey,
      },
    })

    if (data?.accountName && !Array.isArray(data?.accountName)) {
      dispatch({
        type: VALIDATED_PHONE_NUMBER, payload: {
          ...data,
          accountName: data.accountName.trim().replace(/undefined/gim, ""),
        }
      });

    } else if (data?.accountName && Array.isArray(data?.accountName)) {
      dispatch({
        type: VALIDATED_OPTIONS_PHONE_NUMBER, payload: {
          ...data,
          accountName: data.accountName.map((val: any) =>
            val.trim().replace(/undefined/gim, "")
          ),
        }
      });
    }

    if (!data.accountName) {
      toastError(customErrorMessage);
    }
  }
  catch (error) {
    return error
  } finally {
    dispatch({ type: VALIDATING_PHONE_NUMBER, payload: false });
  }
};

export const handleVerifyUser = (dispatch: (data: any) => void) => async ({ accountNumber, bankCode, bvn }: any) => {
  const payload = {
    accountNumber,
    bankCode,
    bvn,
  };


  try {
    dispatch({ type: SET_PAGE_LOADING, payload: true });
    const { appKey } = await getApiAndToken();

    const { data: { data } } = await api
      .post('/banks/enroll-user', payload, {
        headers: {
          appKey,
        },
      });

    fetchUserIdLinkedToBVNAction(dispatch)({ bankCode, bvn }); // fetches users linked aliases
    dispatch({ type: SET_USER_EXIST, payload: data?.userExist });

  }
  catch (error) {
    dispatch({ type: SET_USER_EXIST, payload: null });
    toastError(error?.response?.data?.message);
  }
  finally {
    dispatch({ type: SET_PAGE_LOADING, payload: false });
  }
};

export const handleInitiateUnlink = (dispatch: (data: any) => void, resend = false) => async ({ userId }: any) => {

  try {
    if (!resend) {
      dispatch({ type: SET_ACTION_LOADING, payload: true })
    }

    const { appKey, selectedBank } = await getApiAndToken();

    const payload = {
      userId,
      bankCode: selectedBank?.bankCode,
    };

    await api
      .post('/banks/unlink/account/otp', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(`OTP sent to ${payload.userId}`);

    if (!resend) {
      navigate("OtpScreen");
    }

  }
  catch (error) {
    toastError(error?.response?.data?.message);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const handleUnlink = (dispatch: (data: any) => void) => async ({ userId, otp }: any) => {

  try {
    const { accountNumber, appKey, bvn, selectedBank } = await getApiAndToken();

    const payload = {
      userId,
      otp: Object.values(otp).join(""),
      bankCode: selectedBank?.bankCode,
    };

    dispatch({ type: SET_ACTION_LOADING, payload: true });

    await api
      .post('/banks/activate/unlink/account', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(`${payload.userId} has been unlinked successfully`);
    dispatch({ type: SET_UNLINK_SUCCESSFUL, payload: true })
    handleVerifyUser(dispatch)({ accountNumber, bankCode: selectedBank?.bankCode, bvn });
    fetchUserIdLinkedToBVNAction(dispatch)({ bankCode: selectedBank?.bankCode, bvn });
  }
  catch (error) {
    toastError(error?.response?.data?.message);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

/**
 * This will initiate linking by sending an OTP to the user
 */
export const handleInitiateLinking = (dispatch: (data: any) => void, resend = false) => async ({ userId }: any) => {
  try {
    const { accountNumber, appKey, bvn, selectedBank } = await getApiAndToken();

    const payload = {
      accountNumber: accountNumber,
      bankCode: selectedBank?.bankCode,
      phoneNumber: userId,
    };

    if (resend === false) {
      dispatch({ type: SET_ACTION_LOADING, payload: true });
    }

    const { data: { message } } = await api
      .post('/banks/link-account-otp', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message);

    if (resend === false) {
      navigate("OtpScreen");
    }


  } catch (error) {
    toastError(error?.response?.data?.message)
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const handleIndependentLinking = (dispatch: (data: any) => void) => async ({ userId, otp }: any) => {
  try {
    dispatch({ type: SET_ACTION_LOADING, payload: true });

    const { senderFullName, accountNumber, appKey, bvn, selectedBank } = await getApiAndToken();

    const payload = {
      phoneNumber: userId,
      otp: Object.values(otp).join(""),
      accountName: senderFullName,
      bankCode: selectedBank?.bankCode,
      bvn,
    };

    const { data: { message } } = await api
      .post('/banks/link-account', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message);
    dispatch({ type: RESET_OTP_FIELDS });
    dispatch({ type: SET_LINK_SUCCESSFUL, payload: true });
    handleVerifyUser(dispatch)({ accountNumber, bankCode: selectedBank?.bankCode, bvn });
    replace("Home");
  } catch (error) {
    toastError(error?.response?.data?.message);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

/**
 * Initial Linking (When a user wants to send money and is not enrolled yet)
 *
 **/
export const handleSendOTP = (dispatch: (data: any) => void, resend = false) => async () => {
  try {
    const { phoneNumber, accountNumber, appKey, selectedBank } = await getApiAndToken();

    const payload = {
      accountNumber,
      bankCode: selectedBank?.bankCode,
      phoneNumber,
    };

    dispatch({ type: SET_ACTION_LOADING, payload: true });

    const { data: { message } } = await api
      .post('/banks/link-status', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message);

    if (resend === false) {
      navigate("OtpScreen");
    }
  }
  catch (error) {
    toastError(error?.response?.data?.message)
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const handleLinking = (dispatch: (data: any) => void) => async ({ otp }: any) => {
  try {
    const { accountNumber, phoneNumber, senderFullName, bvn, appKey, selectedBank } = await getApiAndToken();

    const payload = {
      phoneNumber,
      otp: Object.values(otp).join(""),
      bankCode: selectedBank?.bankCode,
      bvn,
      accountName: senderFullName,
    };

    dispatch({ type: SET_ACTION_LOADING, payload: true });

    const { data: { message } } = await api
      .post('/banks/activate/link-status', payload, {
        headers: {
          appKey,
        },
      });

    toastSuccess(message);
    dispatch({ type: SET_LINK_SUCCESSFUL, payload: true });
    handleVerifyUser(dispatch)({ accountNumber, bankCode: selectedBank?.bankCode, bvn });
  } catch (error) {
    toastError(error?.response?.data?.message)
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

  const { data } = await api
    .post('/banks/transactions/transfer/bank_kwiklli', payload, {
      headers: {
        appKey,
      },
    });

    toastSuccess(data?.message);
    dispatch({ type: SET_TRANSFER_SUCCESSFUL, payload: true });
    replace("Home");
  }
  catch (error) {
    toastError(error?.response?.data?.message);
  }
  finally {
    dispatch({ type: SET_ACTION_LOADING, payload: false });
  }
};

export const handleFetchMaxTransferAmount = async (dispatch: (data: any) => void) => {
  try {
    const { token } = await getApiAndToken();
    const { data: { data } } = await api
    .get('/transactions/maximum-transfer-amount', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: SET_MAX_TRANSFER_AMOUNT, payload: Number(data?.value) / 100 });
  }
  catch(error){
    dispatch({ type: SET_MAX_TRANSFER_AMOUNT, payload: "0" });
  }
};

/**
 * Gets the reversal duration for a transaction
 */
export const handleFetchMaxTransfer = async (dispatch: (data: any) => void) => {
  try {
    const { token } = await getApiAndToken();

    const { data: { data } } = await api
    .get('/transactions/reversal-time', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: SET_REVERSAL_DURATION, payload: data?.value });

  }
  catch(error){
    dispatch({ type: SET_REVERSAL_DURATION, payload: "0" });
  }
};
