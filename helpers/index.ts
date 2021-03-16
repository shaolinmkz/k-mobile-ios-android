import { phonePrefix as phoneNumberPrefix, telcoPrefixes } from "./phoneNumberPrefixes";

export const anonymousFunc = () => null;

/**
 * @function timerConverter
 * @description formats milliseconds into a (minute : seconds) timer clock
 */
 export const timerConverter = {
  sec: (minuteValue: string, secondsValue: number) => {
    if (minuteValue === "00") {
      return "00";
    }
    if (secondsValue <= 10) {
      return secondsValue === 0 ? 60 : `0${secondsValue - 1}`;
    }
    return `${secondsValue - 1}`;
  },
  min: (minuteValue: number, secondsValue: number) => {
    if (secondsValue <= 0) {
      return minuteValue - 1 || "00";
    }
    if (minuteValue <= 10) {
      return `0${minuteValue}`;
    }
    return `${minuteValue}`;
  },
};

export const ternaryResolver = (
  resolvedExpression: any,
  truthyValue: any,
  falsyValue: any,
) => {
  return resolvedExpression ? truthyValue : falsyValue;
};

export const fallbackResolver = (actualValue: any, fallbackValue: any) => {
  return actualValue || fallbackValue;
};

export const isValidEmail = (email: string) => {
  const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return pattern.test(email);
};

export const delayExecution = {
  debounce: (callback: () => void, delay = 5000) => setTimeout(callback, delay),
};

export const currencyConverter = {
  toNaira: (amount: (number | string)) => {
    amount = Number(amount);

    amount.toLocaleString('en-NG', {
    style: "currency",
    currency: 'NGN',
  })
},
  strip: (value: (string | number)) => `${value}`
      .split("")
      .filter((val) => Number.isInteger(+`${val}`) && val !== " ")
      .join(""),
};

export const findTelco = (phoneNumber: string, telcos = telcoPrefixes) => {
  return telcos.find(
    ({ prefix }) => prefix === `${phoneNumber}`.slice(0, prefix.length)
  )?.name;
};

export const isValidAlphabet = (text: string) => /^[a-zA-Z -]*$/.test(text);

export const isValidPhoneNumber = (value: string) => {

  if(`${value}`.slice(0, 4) === '+234') {
    value = `0${`${value}`.slice(4)}`
  } else if(`${value}`.slice(0, 3) === '234') {
    value = `0${`${value}`.slice(3)}`
  }

  return !!phoneNumberPrefix.find(
    (prefix) => prefix === `${value}`.slice(0, prefix.length)
  ) &&
  `${value}`.length === 11 &&
  /^[0-9]*$/.test(value);
};

export const sanitizePhoneNumber = (value: string) => {
  if(`${value}`.slice(0, 4) === '+234') {
    value = `0${`${value}`.slice(4)}`
  } else if(`${value}`.slice(0, 3) === '234') {
    value = `0${`${value}`.slice(3)}`
  }

  return value
}

/**
 * @function combinedValidators
 * @description combines different validatiors used in the app
 */
export const combinedValidators = {
  phoneAndEmail: (value: string) =>
    !(
      (!isValidEmail(value) &&
        !/^[0-9]*$/.test(value) &&
        `${value}`.length !== 11) ||
      (/^[0-9]*$/.test(value) && !isValidPhoneNumber(value)) ||
      (!Number.isInteger(+`${value}`) && !isValidEmail(value))
    ),
};
