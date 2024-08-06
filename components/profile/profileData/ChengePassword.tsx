import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button, Modal, Portal, TextInput } from "react-native-paper";

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
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button
            style={styles.button}
            mode="contained"
            onPress={handlePasswordOk}
          >
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
});
