export const SEND_MONEY = "SEND_MONEY";
export const INITIAL_LINKING = "INITIAL_LINKING";
export const INDEPENDENT_LINKING = "INDEPENDENT_LINKING";
export const INDEPENDENT_UNLINKING = "INDEPENDENT_UNLINKING";

export const resolveActions = (value: any) => ({
  isInitialLinking: INITIAL_LINKING === value,
  isIndependentLinking: INDEPENDENT_LINKING === value,
  isSendMoney: SEND_MONEY === value,
  isUnLinking: INDEPENDENT_UNLINKING === value,
});

