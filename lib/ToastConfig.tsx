import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ToastConfig, ToastConfigParams } from "react-native-toast-message";

// Define a type for toast state parameters
interface ToastInternalState {
  text1: string | undefined;
  text2?: string | undefined;
}

// Define custom Toast configuration
const toastConfig: ToastConfig = {
  // Configuration for success toasts
  success: ({ text1, text2 }: ToastConfigParams<ToastInternalState>) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <Text style={styles.toastText}>{text1 || "Success"}</Text>
      {text2 && <Text style={styles.toastText}>{text2}</Text>}
    </View>
  ),

  // Configuration for error toasts
  error: ({ text1, text2 }: ToastConfigParams<ToastInternalState>) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <Text style={styles.toastText}>{text1 || "Error"}</Text>
      {text2 && <Text style={styles.toastText}>{text2}</Text>}
    </View>
  ),

  // Configuration for info toasts
  info: ({ text1, text2 }: ToastConfigParams<ToastInternalState>) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <Text style={styles.toastText}>{text1 || "Info"}</Text>
      {text2 && <Text style={styles.toastText}>{text2}</Text>}
    </View>
  ),
};

// Define styles for Toast
const styles = StyleSheet.create({
  toastContainer: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  // Style for success toasts
  successToast: {
    backgroundColor: "#4CAF50", // Green background for success
  },
  // Style for error toasts
  errorToast: {
    backgroundColor: "#F44336", // Red background for error
  },
  // Style for info toasts
  infoToast: {
    backgroundColor: "#2196F3", // Blue background for info
  },
  toastText: {
    color: "white", // White text
    fontSize: 16,
  },
});

export default toastConfig;
