import {
  RESET_STATE,
  LOGIN,
  SELECT_BANK,
  CHANGE_SETUP_INPUT,
  SHOW_FIELD_ERRORS,
  HIDE_FIELD_ERRORS,
  LOGIN_LOADING,
  STOP_LOGIN_LOADING,
} from '../types';
import { registeredBanks } from '../../db';
import { IAction, IInitialState } from '../../Interfaces/index';


const initialState: IInitialState = {
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
};


const rootReducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
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
    case RESET_STATE:
      return initialState
    default:
      return state;
  }
};

export default rootReducer;
