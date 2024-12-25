import { useCreatePostMutation } from "@/redux/api/postApi";
import { UserData } from "@/types/contantType";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Modal,
  Provider as PaperProvider,
  Portal,
} from "react-native-paper";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor"; // Imported RichEditor & RichToolbar
import { z } from "zod";

// Define the schema using Zod
const postSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty."),
});

const CreatePost = ({ user }: { user: UserData | null }) => {
  const userId = user ? user.id : null;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [content, setContent] = useState("");
  const richText = useRef<RichEditor>(null); // Reference for RichEditor
  const scrollRef = useRef<ScrollView>(null);

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleInputClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setContent("");
  };

  const handleCreatePost = async () => {
    // Trim the content before validation
    const trimmedContent = content.trim();

    try {
      // Validate content using Zod schema
      postSchema.parse({ content: trimmedContent });

      if (trimmedContent) {
        const post = { description: trimmedContent, user: userId };
        const result = await createPost({ data: post });
        if (result) {
          setIsModalVisible(false);
          setContent("");
          Alert.alert(
            "Success",
            "Thanks for sharing your valuable information"
          );
        } else {
          Alert.alert("Error", "Something went wrong. Please try again later.");
        }
      } else {
        Alert.alert("Validation Error", "Post content cannot be empty.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.errors[0].message);
      } else {
        console.error("Error creating post:", error);
        Alert.alert("Error", "An error occurred while creating the post.");
      }
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity style={styles.fab} onPress={handleInputClick}>
          <Ionicons name="add-circle" size={30} color="#4B5563" />
        </TouchableOpacity>

        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={handleModalCancel}
            contentContainerStyle={styles.modalContainer}
          >
            {userId ? (
              <View>
                <Text style={styles.modalTitle}>Create Post</Text>
                <ScrollView
                  ref={scrollRef}
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContentContainer}
                >
                  {/* RichEditor */}

                  <RichEditor
                    ref={richText}
                    style={styles.editor}
                    placeholder="Start typing here..."
                    initialContentHTML={content}
                    onChange={(text) => setContent(text)}
                  />
                </ScrollView>

                {/* RichToolbar */}
                <RichToolbar
                  editor={richText}
                  actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertOrderedList,
                    actions.insertBulletsList,
                    actions.insertImage,
                    actions.insertVideo,
                  ]}
                  style={styles.toolbar}
                />

                <Button
                  mode="contained"
                  onPress={handleCreatePost}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.submitButton}
                >
                  Submit
                </Button>
                <Button
                  mode="text"
                  onPress={handleModalCancel}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            ) : (
              <View style={styles.centeredContainer}>
                <Text style={styles.loginPrompt}>
                  Please log in first to create a post.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push("/profile")}
                  style={styles.loginButton}
                >
                  Login
                </Button>
              </View>
            )}
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 32,
    backgroundColor: "#E5E7EB",
    borderRadius: 40,
    padding: 16,
    elevation: 4,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "white",
  },
  scrollContainer: {
    maxHeight: 300,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },

  editor: {
    flex: 1,
    // borderColor: "#ccc",
    // borderWidth: 1,
    height: 200,
    padding: 10,
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 5,
  },
  centeredContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loginPrompt: {
    fontSize: 16,
    marginBottom: 20,
    color: "#2563EB",
  },
  loginButton: {
    marginTop: 20,
  },
});

export default CreatePost;
