import { KeyboardTypeOptions } from "react-native";

export interface IBank {
  appName: string,
  appIcon: string,
  apiKey: string,
  bankCode: string,
  label: string,
  value: string,
}

export interface IInitialState {
  kwiklliLogo: string;
  registeredBanks: Array<IBank>;
  selectedBank: IBank | null,
  accountNumber: string | undefined,
  bvn: string | undefined,
  phoneNumber: string | undefined,
  senderFullName: string,
}

export interface IAppState {
  appState: IInitialState
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
}
