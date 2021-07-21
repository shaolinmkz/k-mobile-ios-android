import { useRoute } from "@react-navigation/native";
import {
  resolveActions,
  INDEPENDENT_LINKING,
  INDEPENDENT_UNLINKING,
  INITIAL_LINKING,
  SEND_MONEY,
 } from "../constants/actions";
import { fallbackResolver } from "../helpers";
import { IParamRoute } from "../Interfaces";

interface IHavHook {
  action?: string;
}


const useNavJourney = (args?: IHavHook) => {
  const route = useRoute<IParamRoute>();
  const action = fallbackResolver(args?.action, route.params.action);

  const actions = resolveActions(action);

  const isLinking = actions.isInitialLinking;
  const isSendMoney = actions.isSendMoney;
  const isIndependentLinking = actions.isIndependentLinking;
  const isUnLinking = actions.isUnLinking;

  const screenJourneyData = [
    {
      text: "Select an account to link an alias to",
      actionText: "Link",
      action,
      active: isLinking,
      nextScreen: "LinkAlias",
      description: "link a phone number or email to an bank account number for the first time",
      activeAction: INITIAL_LINKING,
    },
    {
      text: "Select an account to debit",
      actionText: "Send",
      action,
      active: isSendMoney,
      nextScreen: "SelectAlias",
      description: "send money to phone number or email from your bank account",
      activeAction: SEND_MONEY,
    },
    {
      text: "Select an account to link an alias to",
      actionText: "Link",
      action,
      active: isIndependentLinking,
      nextScreen: "LinkAlias",
      description: "link another phone number or email to a bank account number",
      activeAction: INDEPENDENT_LINKING,
    },
    {
      text: "Select an account to unlink an alias from",
      actionText: "Unlink",
      action,
      active: isUnLinking,
      nextScreen: "UnlinkAlias",
      description: "unlink phone number or email from your account number",
      activeAction: INDEPENDENT_UNLINKING
    },
  ];

  const activeJourney = screenJourneyData.find(({ active }) => active === true);

  return {
    screenJourneyData,
    activeJourney,
  }
};


export default useNavJourney;
