import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from "@/redux/api/commentApi";
import { singleCommentForPostData } from "@/types/contantType";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const PostComments = ({
  postId,
  postComment,
  userId,
  varifiedSine,
}: {
  postId: number;
  postComment: singleCommentForPostData[] | undefined;
  userId: number | undefined;
  varifiedSine: boolean | undefined;
}) => {
  const currentUserId = userId || 0;
  const [newComment, setNewComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalComment, setModalComment] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const [createComment] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [updateComment] = useUpdateCommentMutation();

  const dropdownRef = useRef<View>(null);

  const isValidComment = (comment: string) => /\w/.test(comment);

  // const handleAddComment = async () => {
  //   if (!currentUserId) {
  //     return Alert.alert("Please log in first to comment");
  //   }
  //   if (!isValidComment(newComment)) {
  //     return Alert.alert("Please write something meaningfull");
  //   }
  //   try {
  //     await createComment({
  //       data: { user: currentUserId, post: postId, comment: newComment },
  //     });
  //     setNewComment("");
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //   }
  // };

  const handleModalAddComment = async () => {
    setModalVisible(false);
    setEditModalVisible(false);
    if (!userId) {
      return Alert.alert("Please log in first to comment");
    }

    if (!isValidComment(modalComment)) {
      return Alert.alert("Please write something meaningfull");
    }
    try {
      const result = await createComment({
        data: { user: currentUserId, post: postId, comment: modalComment },
      });
      console.log(result, modalComment);
      if (result) {
        Alert.alert("Comment successful");
      } else {
        Alert.alert("Something went wrong. Try again later");
      }
      setModalComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const result = await deleteComment({ postId: commentId });
      if (result) {
        Alert.alert("Comment deleted successfully");
      } else {
        Alert.alert("Something went wrong. Try again later");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdateComment = async () => {
    setEditModalVisible(false);
    if (editCommentId && isValidComment(editCommentText)) {
      try {
        await updateComment({
          commentId: editCommentId,
          data: {
            comment: editCommentText,
          },
        });
      } catch (error) {
        console.error("Error updating comment:", error);
        Alert.alert("Sorry for the technical issue, try again later");
      }
    } else {
      Alert.alert("Please write something meaningfull");
    }
  };

  const handlePressOutside = () => {
    setDropdownVisible(null);
  };

  const renderDropdownMenu = (commentId: number) => {
    if (editModalVisible) return null;

    return (
      <View ref={dropdownRef} style={styles.dropdownMenu}>
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => {
            const commentToEdit = postComment?.find(
              (comment) => comment.id === commentId
            );
            if (commentToEdit) {
              setEditCommentId(commentId);
              setEditCommentText(commentToEdit.attributes.comment);
              setEditModalVisible(true);
              setDropdownVisible(null);
            }
          }}
        >
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => handleDeleteComment(commentId)}
        >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderComment = (comment: singleCommentForPostData) => (
    <View key={comment.id} style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUsername}>
          {comment.attributes.user.data.attributes.username}
          {varifiedSine && (
            <Ionicons name="checkmark-circle" size={16} color="blue" />
          )}
        </Text>
        {currentUserId === comment.attributes.user.data.id && (
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => {
              setDropdownVisible((prev) =>
                prev === comment.id ? null : comment.id
              );
            }}
          >
            <Ionicons name="ellipsis-vertical" size={16} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.commentText}>{comment.attributes.comment}</Text>
      {dropdownVisible === comment.id && renderDropdownMenu(comment.id)}
    </View>
  );

  const commentsToShow = showAllComments
    ? postComment
    : postComment?.slice(0, 1);

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setModalVisible(true)}
        >
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            editable={false}
          />
        </TouchableOpacity>
        {/* <View style={styles.commentButons}>
          <TouchableOpacity onPress={handleAddComment} style={[styles.button]}>
            <Text style={styles.buttonText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[styles.button, styles.buttonModal]}
          >
            <Ionicons name="expand" size={20} color="white" />
          </TouchableOpacity>
        </View> */}
        <ScrollView contentContainerStyle={styles.commentList}>
          {commentsToShow?.map(renderComment)}
          {postComment && postComment.length > 1 && (
            <Text
              onPress={() => setShowAllComments(!showAllComments)}
              style={styles.showMoreButton}
            >
              <Text
                style={styles.showMoreText}
                onPress={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments ? "Show Less comment" : "Show More comment"}
              </Text>
            </Text>
          )}
        </ScrollView>
        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="Write a comment..."
              value={modalComment}
              onChangeText={setModalComment}
              multiline={true} // This allows the input to be multiline
              numberOfLines={4} // You can adjust the number of lines based on your needs
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={handleModalAddComment}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Post Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButtonClose}
            >
              <Text style={styles.modalButtonTextClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal visible={editModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.modalInput}
              placeholder="Edit your comment..."
              value={editCommentText}
              onChangeText={setEditCommentText}
            />
            <TouchableOpacity
              onPress={handleUpdateComment}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Update Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.modalButtonClose}
            >
              <Text style={styles.modalButtonTextClose}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,

    marginBottom: 10,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonModal: {
    backgroundColor: "#28a745",
  },
  commentButons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentList: {
    paddingVertical: 8,
  },
  commentContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
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
  commentAction: {
    paddingHorizontal: 8,
  },
  dropdownMenu: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 8,
  },
  showMoreButton: {
    textAlign: "center",
    width: 100,
    marginVertical: 8,
    padding: 8,
    backgroundColor: "#4B5563",
    borderRadius: 4,
  },
  showMoreText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    paddingVertical: 12,
    marginBottom: 8,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButtonClose: {
    backgroundColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 12,
  },
  modalButtonTextClose: {
    color: "#000",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default PostComments;
