import {
  RESET_STATE,
  LOGIN,
  SELECT_BANK,
  CHANGE_SETUP_INPUT,
  SHOW_FIELD_ERRORS,
  HIDE_FIELD_ERRORS,
  LOGIN_LOADING,
  STOP_LOGIN_LOADING,
  APP_STATE_UPDATE,
  SET_LINKED_ALIASES,
  VALIDATING_PHONE_NUMBER,
  VALIDATED_PHONE_NUMBER,
  VALIDATED_OPTIONS_PHONE_NUMBER,
  SET_PAGE_LOADING,
  SET_USER_EXIST,
  SET_ACTION_LOADING,
  SET_UERID,
  SET_LINK_SUCCESSFUL,
  SET_UNLINK_SUCCESSFUL,
  RESET_OTP_FIELDS,
  SET_TRANSFER_SUCCESSFUL,
  SET_REVERSAL_DURATION,
  SET_MAX_TRANSFER_AMOUNT,
  LOGOUT,
  SET_WELCOME_MODAL,
  SET_ALL_CONTACTS,
  SET_SPLASH_SCREEN,
  SET_GLOBAL_SUCCESS,
  SET_GLOBAL_ERROR,
  SET_LOGOUT_MODAL,
} from '../types';
import { registeredBanks } from '../../db';
import { IAction, IInitialState } from '../../Interfaces/index';

const initialChars = {
  char1: "",
  char2: "",
  char3: "",
  char4: "",
  char5: "",
  char6: "",
};

export const initialState: IInitialState = {
  kwiklliLogo: "https://res.cloudinary.com/shaolinmkz/image/upload/v1605358954/softcom/kwiklli/npay-logo.svg",
  registeredBanks,
  loginLoading: false,
  showFieldError: false,
  selectedBank: null,
  userData: null,
  token: "",
  accountNumber: "",
  bvn: "",
  phoneNumber: "",
  senderFullName: "",
  linkedAliases: [],
  isValidatingPhoneNumber: false,
  receiverId: "",
  amount: "",
  unlinkSuccessful: false,
  linkSuccessful: false,
  transferSuccessful: false,
  userExist: null,
  hasChecked: false,
  actionLoading: false,
  otp: initialChars,
  userId: "",
  validatedDataOptions: null,
  validatedData: null,
  isLinked: false,
  maxAmount: 0,
  reversalDuration: "0",
  pageLoading: true,
  showWelcomeModal: true,
  splashScreenOpen: true,
  allContacts: [],
  globalErrorMessage: undefined,
  globalSuccessMessage: undefined,
  logoutModalOpen: false,
};


const rootReducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOGOUT_MODAL:
      return {
        ...state,
        logoutModalOpen: payload,
      };
    case SET_GLOBAL_SUCCESS:
      return {
        ...state,
        globalSuccessMessage: payload,
      };
    case SET_GLOBAL_ERROR:
      return {
        ...state,
        globalErrorMessage: payload,
      };
    case SET_SPLASH_SCREEN:
      return {
        ...state,
        splashScreenOpen: payload,
      };
    case SET_ALL_CONTACTS:
      return {
        ...state,
        allContacts: payload,
      };
    case SET_WELCOME_MODAL:
      return {
        ...state,
        showWelcomeModal: payload,
      };
    case SET_MAX_TRANSFER_AMOUNT:
      return {
        ...state,
        maxAmount: payload,
      };
    case SET_REVERSAL_DURATION:
      return {
        ...state,
        reversalDuration: payload,
      };
    case SET_TRANSFER_SUCCESSFUL:
      return {
        ...state,
        transferSuccessful: payload,
      };
    case RESET_OTP_FIELDS:
      return {
        ...state,
        otp: initialChars,
      };
    case SET_UNLINK_SUCCESSFUL:
      return {
        ...state,
        unlinkSuccessful: payload,
      };
    case SET_LINK_SUCCESSFUL:
      return {
        ...state,
        linkSuccessful: payload,
      };
    case SET_ACTION_LOADING:
      return {
        ...state,
        actionLoading: payload,
      };
    case SET_UERID:
      return {
        ...state,
        userId: payload,
      };
    case SET_USER_EXIST:
      return {
        ...state,
        userExist: payload,
      };
    case SET_PAGE_LOADING:
      return {
        ...state,
        pageLoading: payload,
      };
    case VALIDATED_OPTIONS_PHONE_NUMBER:
      return {
        ...state,
        validatedDataOptions: payload,
      };
    case VALIDATED_PHONE_NUMBER:
      return {
        ...state,
        validatedData: payload,
      };
    case VALIDATING_PHONE_NUMBER:
      return {
        ...state,
        isValidatingPhoneNumber: payload,
      };
    case SET_LINKED_ALIASES:
      return {
        ...state,
        linkedAliases: payload,
      };
    case LOGIN_LOADING:
      return {
        ...state,
        loginLoading: true,
      };
    case STOP_LOGIN_LOADING:
      return {
        ...state,
        loginLoading: false,
      };
    case LOGIN:
      return {
        ...state,
        token: payload.token,
        userData: payload.userData,
        loginLoading: false,
      };
    case SELECT_BANK:
      return {
        ...state,
        selectedBank: payload
      };
    case CHANGE_SETUP_INPUT:
      return {
        ...state,
        [payload.name]: payload.value
      };
    case SHOW_FIELD_ERRORS:
      return {
        ...state,
        showFieldError: true,
      };
    case HIDE_FIELD_ERRORS:
      return {
        ...state,
        showFieldError: false,
      };
    case APP_STATE_UPDATE:
      return {
        ...state,
        ...payload,
      };
    case LOGOUT:
      return {
        ...initialState,
        senderFullName: state.senderFullName,
        accountNumber: state.accountNumber,
        phoneNumber: state.phoneNumber,
        bvn: state.bvn,
        pageLoading: true,
      }
    case RESET_STATE:
      return initialState
    default:
      return state;
  }
};

export default rootReducer;
