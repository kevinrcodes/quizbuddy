import Store from "electron-store";

const testStore = new Store();
const val = testStore.get("foo") as string;
