import {
  useCreateCommentMutation,
  useGetCommentOfPostQuery,
} from "@/redux/api/commentApi";

import { Post } from "@/types/contantType";
import React, { useRef } from "react";

import { formatDistanceToNow } from "date-fns";
import { StyleSheet, View } from "react-native";
import PostActions from "./postCard/PostActions";
import PostComments from "./postCard/PostComments";
import PostContent from "./postCard/PostContent";
import PostHeader from "./postCard/PostHeader";

function SinglePost({
  post,
  userId,
  varifiedSine,
}: {
  post: Post;
  userId: number | undefined;
  varifiedSine: boolean | undefined;
}) {
  const dropdownRef = useRef<View>(null);

  const [createComment] = useCreateCommentMutation();

  const { data: postComments } = useGetCommentOfPostQuery({ postId: post?.id });

  const postComment = postComments?.data;
  const totalComment = postComments?.meta.pagination.total || 0;
  const postDescription = post.attributes.description;
  const postUserName = post.attributes.user.data.attributes.username;
  const postAt = formatDistanceToNow(new Date(post.attributes.createdAt), {
    addSuffix: true,
  });
  const postUserId = post.attributes.user.data.id;
  const postId = post.id;

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <View style={styles.postCard}>
          <PostHeader
            postUserId={postUserId}
            postUserName={postUserName}
            postAt={postAt}
            varifiedSine={varifiedSine}
          />
          <PostContent postDescription={postDescription} />
          <PostActions totalComment={totalComment} userId={userId} />
          <PostComments
            postId={postId}
            postComment={postComment}
            userId={userId}
            varifiedSine={varifiedSine}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    margin: 6,
    // backgroundColor: "#f9f9f9",
    borderWidth: 0.5,
    marginBottom: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  postContainer: {
    flexGrow: 1,
  },
  postCard: {
    borderRadius: 10,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // padding: 16,
    // marginBottom: 10,
  },
});

export default SinglePost;
