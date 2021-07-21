import { IBank } from '../Interfaces';

const loginCredentials = {
  username: "oluwole.s@softcom.ng",
  password: "123456",
};

// taj bank logo
// https://res.cloudinary.com/shaolinmkz/image/upload/v1612356666/Random-Icons/taj-bank.png

// Zenith Bank logo
// https://res.cloudinary.com/shaolinmkz/image/upload/v1626638042/Random-Icons/zenith-bank.png

// First Bank logo
// https://res.cloudinary.com/shaolinmkz/image/upload/v1626638109/Random-Icons/FirstBank.png

// GTBank logo
// https://res.cloudinary.com/shaolinmkz/image/upload/v1626638304/Random-Icons/gtb-logo.png

// Access bank logo
// https://res.cloudinary.com/shaolinmkz/image/upload/v1626638585/Random-Icons/access-bank.png


export const registeredBanks: Array<IBank> = [
  {
    appName: "Select a bank",
    appIcon: "https://res.cloudinary.com/shaolinmkz/image/upload/v1605358954/softcom/kwiklli/npay-logo.svg",
    apiKey: "",
    bankCode: "",
    label: "Select a bank",
    value: "",
    username: "",
    password: "",
  },
  {
    appName: "Zenith Bank",
    appIcon: "https://res.cloudinary.com/shaolinmkz/image/upload/v1626638042/Random-Icons/zenith-bank.png",
    apiKey: "MWW-iuTrA.c619fc23-3d57-49cf-a048-6fe07d7c93e0",
    bankCode: "000015",
    label: "Zenith Bank",
    value: "000015",
    ...loginCredentials,
  },
];
