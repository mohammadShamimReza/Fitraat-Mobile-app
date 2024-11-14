import SinglePost from "@/components/post/SinglePost";
import { useGetUserInfoQuery } from "@/redux/api/authApi";
import { useCreatePostMutation, useGetPostQuery } from "@/redux/api/postApi";
import { useAppSelector } from "@/redux/hooks";
import { Post } from "@/types/contantType";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

const FeedPost = () => {
  const [pageCount, setPageCount] = useState<number>(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]); // State to store all posts
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [content, setContent] = useState("");
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  // const richText = useRef<RichEditor>(null);

  const {
    data: feedPosts,
    isLoading,
    isFetching,
    refetch,
  } = useGetPostQuery({ pageCount });

  const totalPosts = feedPosts?.meta.pagination.total || 0;
  const postsPerPage = 25;

  const [createPost] = useCreatePostMutation();
  const { data: getUserInfoData } = useGetUserInfoQuery();

  const userToken = useAppSelector((store) => store.auth.authToken);
  const userId = getUserInfoData?.id;
  const varifiedSine = getUserInfoData?.varifiedSine;

  // Append new posts to the existing posts
  useEffect(() => {
    if (feedPosts?.data) {
      setAllPosts((prevPosts) => [...prevPosts, ...feedPosts.data]);
    }
  }, [feedPosts]);

  const loadMorePosts = useCallback(() => {
    if (isFetching) return;
    const hasMorePosts = pageCount * postsPerPage < totalPosts;
    if (hasMorePosts) {
      setPageCount((prev) => prev + 1);
    }
  }, [isFetching, pageCount, totalPosts]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPageCount(1);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const handleInputClick = () => {
    setIsModalVisible(true);
  };
  useEffect(() => {
    if (feedPosts?.data) {
      setAllPosts((prevPosts) =>
        pageCount === 1 ? feedPosts.data : [...prevPosts, ...feedPosts.data]
      );
    }
  }, [feedPosts, pageCount]);

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
          handleRefresh(); // Refresh after creating a post
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
                varifiedSine={varifiedSine}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5} // Trigger load more when halfway through the current list
            ListFooterComponent={
              isFetching ? (
                <ActivityIndicator
                  size="large"
                  color="#0000ff"
                  style={styles.loadingIndicator}
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
            {userToken ? (
              <View>
                <Text style={styles.modalTitle}>Create Post</Text>
                {/* <RichEditor
                  ref={richText}
                  style={styles.editor}
                  placeholder="Start typing here..."
                  initialContentHTML={content}
                  onChange={(text) => setContent(text)}
                />

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
                /> */}

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
