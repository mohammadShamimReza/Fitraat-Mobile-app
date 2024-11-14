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
// import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const EditPost = ({ post }: { post: Post }) => {
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);

  const [updatePost] = useUpdatePostMutation();

  const [content, setContent] = useState(post.attributes.description);
  // const richText = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isPostModalVisible) {
      // Reset content with the current post description
      setContent(post.attributes.description);
    }
  }, [isPostModalVisible, post]);

  const handleCursorPosition = (scrollY: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: scrollY - 30, animated: true });
    }
  };

  const handlePostCancel = () => {
    setIsPostModalVisible(false);
  };
  const showPostModal = (post: any) => {
    setIsPostModalVisible(true);
  };

  const handleSave = async () => {
    try {
      console.log(content);
      const result = await updatePost({
        body: {
          postId: post.id,

          data: {
            description: content,
          },
        },
      });

      if (result) {
        Alert.alert("Success", "Post updated successfully!");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }

      // Close the modal and reset content state
      handlePostCancel();
      setContent("");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => showPostModal(post)}
      >
        <Text style={styles.buttonText}>Edit Post</Text>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={isPostModalVisible}
          onDismiss={handlePostCancel}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Edit Post</Text>

          <ScrollView
            ref={scrollRef}
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {/* <RichEditor
              key={post.id} // Force re-render by using key
              ref={richText}
              initialContentHTML={content}
              style={styles.editor}
              onChange={(text) => setContent(text)}
              useContainer={true}
              onCursorPosition={handleCursorPosition}
            /> */}
          </ScrollView>

          {/* <RichToolbar
            editor={richText}
            actions={[
              "bold",
              "italic",
              "underline",
              "unorderedList",
              "orderedList",
              "insertImage",
              "insertVideo",
            ]}
            style={styles.toolbar}
          /> */}

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
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    maxHeight: 300, // Adjust based on your design needs
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  editor: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    minHeight: 150, // Adjust based on your design needs
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
  },
  contentPreview: {
    marginTop: 10,
    fontWeight: "bold",
  },
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
  saveButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 5,
  },
});

export default EditPost;
