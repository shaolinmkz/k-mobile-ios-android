import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { resolveActions } from "../constants/actions";
import { fallbackResolver } from "../helpers";
import { IParamRoute } from "../Interfaces";
import {
  confirmIndependentLinking,
  initiateInitialLinking,
  initiateUnlink,
  confirmUnlink,
  handleVerifyUser,
  validatePhoneNumber,
  initiateIndependentLinking,
  confirmInitialLinking,
  handleTransfer,
} from "../redux/actions";

interface IHavHook {
  action?: string;
}


const useNavJourney = (args?: IHavHook) => {
  const action = args?.action;

  const dispatch = useDispatch();
  const route = useRoute<IParamRoute>();

  const actions = resolveActions(fallbackResolver(action, route.params.action));

  const isLinking = actions.isInitialLinking;
  const isSendMoney = actions.isSendMoney;
  const isIndependentLinking = actions.isIndependentLinking;
  const isUnLinking = actions.isUnLinking;

  const screenJourneyData = [
    {
      text: "Select an account to link an alias to",
      action,
      active: isLinking,
      nextScreen: "LinkAlias",
      description: "link a phone number or email to an bank account number for the first time",
      apiActions: {
        handleVerifyUser: handleVerifyUser(dispatch),
        initiateInitialLinking: (resend = false) => initiateInitialLinking(dispatch, resend),
        confirmInitialLinking: confirmInitialLinking(dispatch),
      },
    },
    {
      text: "Select an account to debit",
      action,
      active: isSendMoney,
      nextScreen: "SelectAlias",
      description: "send money to phone number or email from your bank account",
      apiActions: {
        validatePhoneNumber: validatePhoneNumber(dispatch),
        handleTransfer: handleTransfer(dispatch),
      },
    },
    {
      text: "Select an account to link an alias to",
      action,
      active: isIndependentLinking,
      nextScreen: "LinkAlias",
      description: "link another phone number or email to a bank account number",
      apiActions: {
        handleVerifyUser: handleVerifyUser(dispatch),
        initiateIndependentLinking: (resend = false) => initiateIndependentLinking(dispatch, resend),
        confirmIndependentLinking: confirmIndependentLinking(dispatch)
      },
    },
    {
      text: "Select an account to unlink an alias from",
      action,
      active: isUnLinking,
      nextScreen: "OtpScreen",
      description: "unlink phone number or email from your account number",
      apiActions: {
        handleVerifyUser: handleVerifyUser(dispatch),
        initiateUnlink: (resend = false) => initiateUnlink(dispatch, resend),
        confirmUnlink: confirmUnlink(dispatch),
      },
    },
  ];

  const activeJourney = screenJourneyData.find(({ active }) => active === true);


  return {
    screenJourneyData,
    activeJourney,
  }
};


export default useNavJourney;
