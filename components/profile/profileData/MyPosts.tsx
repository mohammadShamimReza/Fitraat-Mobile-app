import { Post } from "@/types/contantType";
import React from "react";
import { StyleSheet, View } from "react-native";
import DeletePost from "./DeletePost";
import EditPost from "./EditPost";
import CommentsPage from "./UserComments";
import UserPostWebView from "./UserPostWebView";

const MyPosts = ({ postsByUser }: { postsByUser: Post[] | undefined }) => {
  return (
    <View>
      {postsByUser &&
        postsByUser?.map((post) => (
          <View key={post.id} style={styles.postContainer}>
            <UserPostWebView post={post} />
            <EditPost post={post} />
            <DeletePost postId={post.id} />
            <CommentsPage postId={post.id} />
          </View>
        ))}
    </View>
  );
};

export default MyPosts;

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    borderWidth: 0.2,
    padding: 7,
    borderRadius: 5,
  },
});
