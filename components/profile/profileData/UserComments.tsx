import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentOfPostQuery,
} from "@/redux/api/commentApi";
import { useAppSelector } from "@/redux/hooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CommentsPage = ({ postId }: { postId: number }) => {
  const { data, isLoading, refetch } = useGetCommentOfPostQuery({ postId });
  const [newComment, setNewComment] = useState("");

  const userData = useAppSelector((state) => state.auth.userInfo);

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const comments = data?.data || [];

  const handleDeleteComment = async (commentId: number) => {
    try {
      alert("Are you sure you want to delete this comment?");
      await deleteComment({ postId: commentId });
      refetch();
    } catch (error) {
      console.error("Error deleting comment:", error);
      Alert.alert("Error", "Failed to delete comment. Please try again.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("Validation Error", "Comment cannot be empty!");
      return;
    }

    try {
      await createComment({
        data: { user: userData?.id, post: postId, comment: newComment },
      });
      setNewComment("");
      refetch();
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment. Please try again.");
    }
  };

  const renderComment = (comment: any) => (
    <View key={comment.id} style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUsername}>
          {comment?.attributes?.user?.data?.attributes?.username}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteComment(comment.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={18} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.commentText}>{comment.attributes.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Comments</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView
          style={styles.commentsList}
          contentContainerStyle={styles.scrollContent}
        >
          {comments.length > 0 ? (
            comments.map(renderComment)
          ) : (
            <Text style={styles.noCommentsText}>No comments yet.</Text>
          )}
        </ScrollView>
      )}

      {/* Add New Comment */}
      <View style={styles.newCommentContainer}>
        <TextInput
          style={styles.newCommentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          onPress={handleAddComment}
          style={styles.addCommentButton}
        >
          <Text style={styles.addCommentButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  commentsList: {
    flex: 1, // Allow the ScrollView to take up remaining space
    height: 140,
  },
  scrollContent: {
    flexGrow: 1, // Ensure content stretches to allow scrolling
  },
  commentContainer: {
    borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: "#ccc",
    backgroundColor: "#b8d2fc",
    borderRadius: 8,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentUsername: {
    fontWeight: "bold",
  },
  commentText: {
    marginTop: 4,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "transparent",
  },
  newCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  newCommentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  addCommentButton: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  addCommentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noCommentsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
