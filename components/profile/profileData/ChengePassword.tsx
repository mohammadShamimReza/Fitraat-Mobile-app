import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { z } from "zod";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please input your current password!"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password!"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot be the same as the current password!",
    path: ["newPassword"],
  });

const ChengePassword = ({
  showPasswordModal,
  isPasswordModalVisible,
  handlePasswordCancel,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordOk,
}: {
  showPasswordModal: () => void;
  isPasswordModalVisible: boolean;
  handlePasswordCancel: () => void;
  currentPassword: string;
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  handlePasswordOk: () => Promise<void>;
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (setter: any) => {
    setter((prevState: any) => !prevState);
  };

  const handleSubmit = async () => {
    try {
      passwordSchema.parse({ currentPassword, newPassword, confirmPassword });
      await handlePasswordOk(); // Call your existing password update function
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.errors[0].message);
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={showPasswordModal}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <Portal>
        <Modal
          visible={isPasswordModalVisible}
          onDismiss={handlePasswordCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Change Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <IconButton
              icon={showCurrentPassword ? "eye-off" : "eye"}
              onPress={() => togglePasswordVisibility(setShowCurrentPassword)}
            />
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <IconButton
              icon={showNewPassword ? "eye-off" : "eye"}
              onPress={() => togglePasswordVisibility(setShowNewPassword)}
            />
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <IconButton
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={() => togglePasswordVisibility(setShowConfirmPassword)}
            />
          </View>
          <Button mode="contained" onPress={handleSubmit}>
            Save
          </Button>
          <Button mode="text" onPress={handlePasswordCancel}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

export default ChengePassword;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#676c73",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
