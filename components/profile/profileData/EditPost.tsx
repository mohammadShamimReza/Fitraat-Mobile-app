import { useUpdatePostMutation } from "@/redux/api/postApi";
import { Post } from "@/types/contantType";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const EditPost = ({ post }: { post: Post }) => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);
  const [updatePost] = useUpdatePostMutation();
  const [content, setContent] = useState(post.attributes.description);
  const richText = useRef<RichEditor>(null); // Reference for RichEditor

  useEffect(() => {
    if (isPostModalVisible) {
      // Reset content with the current post description
      setContent(post.attributes.description);
    }
  }, [isPostModalVisible, post]);

  const handlePostCancel = () => {
    setIsPostModalVisible(false);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Validation Error", "Post content cannot be empty.");
      return;
    }

    try {
      const result = await updatePost({
        body: {
          postId: post.id,
          data: { description: content },
        },
      });

      if (result) {
        Alert.alert("Success", "Post updated successfully!");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }

      // Close the modal
      handlePostCancel();
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Error", "An error occurred while updating the post.");
    }
  };

  const showPostModal = () => {
    setIsPostModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={showPostModal}>
        <Text style={styles.buttonText}>Edit Post</Text>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={isPostModalVisible}
          onDismiss={handlePostCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Edit Post</Text>

          <ScrollView style={styles.scrollContainer}>
            {/* RichEditor */}
            <RichEditor
              ref={richText}
              style={styles.editor}
              placeholder="Start typing here..."
              initialContentHTML={content}
              onChange={setContent}
            />

            {/* RichToolbar */}
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertOrderedList,
                actions.insertBulletsList,
              ]}
              style={styles.toolbar}
            />
          </ScrollView>

          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save
          </Button>
          <Button
            mode="text"
            onPress={handlePostCancel}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  scrollContainer: {
    width: "100%",
    maxHeight: 300, // Adjust height for better appearance
  },
  editor: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 200, // Minimum height for RichEditor
    // padding: 10,
    backgroundColor: "#f9f9f9", // Light background for editor
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
    borderRadius: 8, // Rounded corners
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  cancelButton: {
    marginTop: 5,
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default EditPost;
