import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PostActions = ({
  totalComment,
  userId,
}: {
  totalComment: number;
  userId: number | undefined;
}) => {
  return (
    <View style={styles.container}>
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
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 20,
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
