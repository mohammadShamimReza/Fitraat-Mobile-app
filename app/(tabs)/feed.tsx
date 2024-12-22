import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
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
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useCreatePostMutation, useGetPostQuery } from "@/redux/api/postApi";
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

  const {
    data: feedPosts,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostQuery({
    pageCount,
    postsPerPage,
  });


  const { data: userInfo } = useGetUserInfoQuery();
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
                <RichEditor
                  ref={richText}
                  style={styles.editor}
                  placeholder="Start typing here..."
                  initialContentHTML={content}
                  onChange={setContent}
                />
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
                  Submit
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
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: "100%",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  editor: {
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
    backgroundColor: "#007bff",
  },
  cancelButton: {
    marginTop: 5,
    borderColor: "#007bff",
    borderWidth: 1,
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
