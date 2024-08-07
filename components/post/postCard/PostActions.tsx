import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PostActions = ({
  totalLikes,
  likedPostForCurrentUser,
  handleLikeUnlickClick,
  totalComment,
  userId,
}: {
  totalLikes: number;
  likedPostForCurrentUser: boolean;
  handleLikeUnlickClick: () => void;
  totalComment: number;
  userId: number | undefined;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.likeContainer}
        onPress={handleLikeUnlickClick}
      >
        {likedPostForCurrentUser ? (
          <Ionicons name="heart" size={30} color="red" />
        ) : (
          <Ionicons name="heart-outline" size={30} color="gray" />
        )}
        <Text style={styles.likeText}>{totalLikes}</Text>
      </TouchableOpacity>

      <View style={styles.commentContainer}>
        <Ionicons name="chatbubble-outline" size={24} color="gray" />
        <Text style={styles.commentText}>{totalComment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#4B5563",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#4B5563",
  },
});

export default PostActions;
