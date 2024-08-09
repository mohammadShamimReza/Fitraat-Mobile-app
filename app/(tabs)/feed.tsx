import SinglePost from "@/components/post/SinglePost";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useCreatePostMutation, useGetPostQuery } from "@/redux/api/postApi";
import { useAppSelector } from "@/redux/hooks";
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
  ActivityIndicator,
  Button,
  Modal,
  Provider as PaperProvider,
  Portal,
} from "react-native-paper";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const FeedPost = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [content, setContent] = useState("");
  const richText = useRef<RichEditor>(null);
  const scrollRef = useRef<ScrollView>(null);

  const {
    data: feedPosts,
    isLoading,
    isFetching,
  } = useGetPostQuery({ pageCount });
  const total = feedPosts?.meta.pagination.total || 0;
  const [createPost] = useCreatePostMutation();
  const { data: getUserInfoData } = useGetUserInfoQuery();

  const userToken = useAppSelector((store) => store.auth.authToken);
  const userId = getUserInfoData?.id;
  const varifiedSine = getUserInfoData?.varifiedSine;
  const posts = feedPosts?.data;

  const handleInputClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setContent("");
  };

  const handleCreatePost = async () => {
    if (content !== "") {
      try {
        const post = { description: content, user: userId };
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
      } catch (error) {
        console.error("Error creating post:", error);
        Alert.alert("Error", "An error occurred while creating the post.");
      }
    } else {
      Alert.alert("Validation Error", "Post content cannot be empty.");
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {isLoading || isFetching ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        ) : (
          <ScrollView>
            {posts?.map((post) => (
              <SinglePost
                key={post.id}
                post={post}
                userId={userId}
                varifiedSine={varifiedSine}
              />
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.fab} onPress={handleInputClick}>
          <Ionicons name="add-circle" size={30} color="#4B5563" />
        </TouchableOpacity>

        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={handleModalCancel}
            contentContainerStyle={styles.modalContainer}
          >
            {userToken ? (
              <View>
                <Text style={styles.modalTitle}>Create Post</Text>
                <ScrollView
                  ref={scrollRef}
                  style={styles.scrollContainer}
                  contentContainerStyle={styles.scrollContentContainer}
                >
                  <RichEditor
                    ref={richText}
                    style={styles.editor}
                    placeholder="Start typing here..."
                    initialContentHTML={content}
                    onChange={(text) => setContent(text)}
                  />
                </ScrollView>

                <RichToolbar
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
                  onPress={() => router.replace("/profile")}
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
    backgroundColor: "#fff",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
  scrollContainer: {
    maxHeight: 300,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  editor: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    minHeight: 200,
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

export default FeedPost;
