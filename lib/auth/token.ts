import * as SecureStore from "expo-secure-store";

// Store JWT in SecureStore
export const storeTokenInSecureStore = async (jwt: string) => {
  if (jwt) {
    await SecureStore.setItemAsync("jwt", jwt);
  }
};

// Retrive JWT in SecureStore
export const getTokenFromSecureStore = async () => {
  try {
    const token = await SecureStore.getItemAsync("jwt");
    return token;
  } catch (error) {
    console.log("Error getting token:", error);
    return null;
  }
};

export const removeTokenFromSecureStore = () => {
  try {
    const removeToken = SecureStore.deleteItemAsync("jwt");
    return removeToken;
  } catch (error) {
    console.error("Error removing token:", error);
  }
};