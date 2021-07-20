import { KeyboardTypeOptions } from "react-native";

export interface IBank {
  appName: string;
  appIcon: string;
  apiKey: string;
  bankCode: string;
  label: string;
  value: string;
  username: string;
  password: string;
}

export interface IAccount {
  senderFullName: any;
  accountNumber: any;
}

export interface IParamRoute {
  key: string;
  name: string;
  params: {
    action?: string;
    account?: IAccount;
  };
}

export interface IInitialState {
  kwiklliLogo?: string;
  registeredBanks?: Array<IBank>;
  selectedBank?: IBank | null;
  accountNumber?: string;
  bvn?: string;
  phoneNumber?: string;
  senderFullName?: string;
  loginLoading?: boolean;
  showFieldError?: boolean;
  token?: string;
  appKey?: string;
  userData?: any;
  linkedAliases?: any[];
  isValidatingPhoneNumber?: boolean;
  receiverId?: string;
  amount?: string;
  unlinkSuccessful?: boolean;
  linkSuccessful?: boolean;
  transferSuccessful?: boolean;
  userExist?: null | boolean;
  hasChecked?: boolean;
  actionLoading?: boolean;
  otp?: {
    char1?: string;
    char2?: string;
    char3?: string;
    char4?: string;
    char5?: string;
    char6?: string;
  };
  userId?: string;
  validatedDataOptions?: [] | null;
  validatedData?: any;
  isLinked?: boolean;
  maxAmount?: string | number;
  reversalDuration?: string | number;
  pageLoading?: boolean;
  showWelcomeModal?: boolean;
  splashScreenOpen?: boolean;
  logoutModalOpen?: boolean;
  allContacts?: any[];
  globalErrorMessage?: string;
  globalSuccessMessage?: string;
}

export interface IAppState {
  appState: IInitialState;
}

export interface IAction {
  type: string;
  payload: any;
}

export interface IInputProps {
  value: string | undefined;
  onChangeText: (value: string) => void | undefined;
  label: string;
  placeholder: string;
  autoCorrect: boolean;
  disabled?: boolean;
  autoCompleteType:
    | "off"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-number"
    | "email"
    | "name"
    | "password"
    | "postal-code"
    | "street-address"
    | "tel"
    | "username"
    | undefined;
  autoCapitalize: "none" | "sentences" | "words" | "characters" | undefined;
  maxLength: number;
  error?: string | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
  clearButtonMode?: "while-editing" | "never" | "unless-editing" | "always" | undefined;
  labelSize?: number | undefined;
  labelColor?: string | undefined;
  inputStyleOveride?: any;
}
