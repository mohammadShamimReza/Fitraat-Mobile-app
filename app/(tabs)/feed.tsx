import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
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
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

import SinglePost from "@/components/post/SinglePost";
import { useCreatePostMutation, useGetPostQuery } from "@/redux/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Post } from "@/types/contantType";
import { router } from "expo-router";
import PaginationButtons from "../freeBlogs/Pagination";

const FeedPost = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [content, setContent] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const richText = useRef<RichEditor>(null);
  const postsPerPage = 25;
  const scrollRef = useRef<ScrollView>(null);

  const {
    data: feedPosts,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostQuery({
    pageCount,
    postsPerPage,
  });

  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const userId = userInfo?.id;
  const verifiedSince = userInfo?.varifiedSine;

  const [createPost] = useCreatePostMutation();

  const totalPosts = feedPosts?.meta.pagination.total || 0;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // Update allPosts when feedPosts changes
  useEffect(() => {
    if (feedPosts?.data) {
      setAllPosts((prevPosts) =>
        pageCount === 1 ? feedPosts.data : [...feedPosts.data]
      );
    }
  }, [feedPosts, pageCount]);

  // Pull-to-refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPageCount(1);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const handleInputClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setContent("");
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert("Validation Error", "Post content cannot be empty.");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not found.");
      return;
    }

    try {
      const post = { description: content, user: userId };
      const result = await createPost({ data: post });

      if (result) {
        setIsModalVisible(false);
        setContent("");
        Alert.alert("Success", "Post created successfully.");
        handleRefresh(); // Refresh posts after successful creation
      } else {
        Alert.alert("Error", "Failed to create post. Try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "An error occurred while creating the post.");
    }
  };

  const handlePageChange = (page: number) => {
    setPageCount(page);
    refetch(); // Fetch posts for the selected page
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {isLoading && pageCount === 1 ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        ) : (
          <FlatList
            data={allPosts}
            renderItem={({ item }) => (
              <SinglePost
                key={item.id}
                post={item}
                userId={userId}
                varifiedSine={verifiedSince}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={
              totalPages > 1 ? (
                <PaginationButtons
                  totalPages={totalPages}
                  currentPage={pageCount}
                  onPageChange={handlePageChange}
                />
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#0000ff"]}
              />
            }
          />
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
            {userId ? (
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
                    onChange={setContent}
                  />
                </ScrollView>
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
                <Button
                  mode="contained"
                  onPress={handleCreatePost}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.submitButton}
                >
                  Post
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleModalCancel}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </View>
            ) : (
              <View style={styles.centeredContainer}>
                <Text style={styles.loginPrompt}>
                  Please log in to create a post.
                </Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    handleModalCancel;
                    router.push("/profile");
                  }}
                  style={styles.loginButton}
                >
                  Login
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleModalCancel}
                  style={styles.loginButton}
                >
                  Cancel
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
    marginVertical: 20,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add semi-transparent background
    padding: 20,
  },
  modalContent: {
    // width: "90%",
    // maxHeight: "80%", // Limit modal height for better appearance
    backgroundColor: "white",
    borderRadius: 10,
    // padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  scrollContainer: {},
  scrollContentContainer: {},

  editor: {
    minWidth: 320,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8, // Rounded corners for better UI
    minHeight: 300,
    // padding: 10,
    fontSize: 16, // Improved font size for better readability
    color: "#333",
    backgroundColor: "#f9f9f9", // Light background for the editor
  },
  toolbar: {
    backgroundColor: "#f1f1f1",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    marginTop: 10,
    borderRadius: 8, // Rounded corners for consistency
    paddingHorizontal: 10,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    paddingVertical: 10,
  },
  cancelButton: {
    marginTop: 10,
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
  },
  centeredContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginPrompt: {
    fontSize: 16,
    marginBottom: 20,
    color: "#2563EB",
    textAlign: "center",
  },
  loginButton: {
    marginTop: 20,
    borderRadius: 8,
  },
});


export default FeedPost;
