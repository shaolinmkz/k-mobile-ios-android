import { IBank } from '../Interfaces';

const loginCredentials = {
  username: "oluwole.s@softcom.ng",
  password: "123456",
};

export const registeredBanks: Array<IBank> = [
  {
    appName: "Zenith Bank",
    appIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/Zenith-Bank-logo.png",
    apiKey: "MWW-iuTrA.c619fc23-3d57-49cf-a048-6fe07d7c93e0",
    bankCode: "000015",
    label: "Zenith Bank",
    value: "000015",
    ...loginCredentials,
  },
  {
    appName: "Access Bank",
    appIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/Zenith-Bank-logo.png",
    apiKey: "MWW-iuTrA.c619fc23-3d57-49cf-a048-6fe07d7c93ss",
    bankCode: "000016",
    label: "Access Bank",
    value: "000016",
    ...loginCredentials,
  },
  {
    appName: "First Bank",
    appIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/Zenith-Bank-logo.png",
    apiKey: "MWW-iuTrA.c619fc23-3d57-49cf-a048-6fe07d7c9xx0",
    bankCode: "000017",
    label: "First Bank",
    value: "000017",
    ...loginCredentials,
  },
];