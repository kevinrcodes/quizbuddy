import Store from "electron-store";

export const store = new Store<Record<string, unknown>>({
  defaults: {},
  encryptionKey: process.env.EKEY
});
