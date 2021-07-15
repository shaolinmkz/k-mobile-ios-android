import {
  RESET_STATE,
  LOGIN,
  SELECT_BANK,
  CHANGE_SETUP_INPUT,
} from '../types';
import { registeredBanks } from '../../db';
import { IAction } from '../../Interfaces/index';


const initialState = {
  kwiklliLogo: "https://res.cloudinary.com/shaolinmkz/image/upload/v1605358954/softcom/kwiklli/npay-logo.svg",
  registeredBanks,
  selectedBank: null,
  accountNumber: "",
  bvn: "",
  phoneNumber: "",
  senderFullName: "",
};


const rootReducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      return {
        ...state,
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
    case RESET_STATE:
      return initialState
    default:
      return state;
  }
};

export default rootReducer;
