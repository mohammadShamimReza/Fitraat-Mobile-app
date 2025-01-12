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
  // Success toast configuration
  success: ({ text1, text2 }: ToastConfigParams<ToastInternalState>) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <View style={styles.background}>
        <Text style={styles.toastText}>{text1 || "Success"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),

  // Error toast configuration
  error: ({ text1, text2 }: ToastConfigParams<ToastInternalState>) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <View style={styles.background}>
        <Text style={styles.toastText}>{text1 || "Error"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),

  // Info toast configuration
  info: ({ text1, text2 }: ToastConfigParams<ToastInternalState>) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <View style={styles.background}>
        <Text style={styles.toastText}>{text1 || "Info"}</Text>
        {text2 && <Text style={styles.toastText}>{text2}</Text>}
      </View>
    </View>
  ),
};

// Define styles for Toast
const styles = StyleSheet.create({
  toastContainer: {
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    elevation: 1000, // For Android layering
    zIndex: 1000, // Higher than any other UI element
    position: "absolute", // Ensure it layers correctly
    top: 0, // Prevent it from being constrained
  },
  background: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparent background overlay
  },
  // Style for success toasts
  successToast: {
    backgroundColor: "#4CAF50", // Green background
  },
  // Style for error toasts
  errorToast: {
    backgroundColor: "#F44336", // Red background
  },
  // Style for info toasts
  infoToast: {
    backgroundColor: "#2196F3", // Blue background
  },
  toastText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default toastConfig;
