import { useDeletePostMutation } from "@/redux/api/postApi";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";

const DeletePost = ({ postId }: { postId: number }) => {
  const [deletePost] = useDeletePostMutation();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const showDeletePostModal = (post: any) => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      const result = await deletePost({ id: postId });
      if (result) {
        Alert.alert("Success", "Post deleted successfully!");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
      setIsDeleteModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };
  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => showDeletePostModal(postId)}
      >
        <Text style={styles.buttonText}>Delete Post</Text>
      </TouchableOpacity>
      <Portal>
        <Modal
          visible={isDeleteModalVisible}
          onDismiss={handleDeleteCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Delete Post</Text>
          <Text style={styles.modalSureTitle}>
            Are you sure you want to delete this post?
          </Text>
          <Button mode="contained" onPress={handleDeleteOk}>
            Delete
          </Button>
          <Button mode="text" onPress={handleDeleteCancel}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default DeletePost;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#676c73",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  modalSureTitle: {
    marginBottom: 25,
    fontSize: 18,
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
    fontSize: 20,
    marginBottom: 10,
  },
});
