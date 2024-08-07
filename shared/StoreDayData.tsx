import AsyncStorage from "@react-native-async-storage/async-storage";

type AllowedKeys = "AuthDay" | "UnAuthDay";

// Save data to AsyncStorage
export const saveUserDayData = async (
  key: AllowedKeys,
  value: {
    video: boolean;
    kagel: boolean;
    quiz: boolean;
    Blog: boolean;
  }
) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data", error);
  }
};

// Retrieve data from AsyncStorage
export const getUserDayData = async (key: AllowedKeys) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving data", error);
  }
};

// Remove data from AsyncStorage
export const removeUserData = async (key: AllowedKeys) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Data removed successfully!");
  } catch (error) {
    console.error("Error removing data", error);
  }
};
