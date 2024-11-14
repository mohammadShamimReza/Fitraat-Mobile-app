import {
  useCreateCommentMutation,
  useGetCommentOfPostQuery,
} from "@/redux/api/commentApi";
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useGetLikeOfPostQuery,
  usePostLikeForCurrentUserQuery,
} from "@/redux/api/likeApi";
import { Post } from "@/types/contantType";
import React, { useRef } from "react";

import { formatDistanceToNow } from "date-fns";
import { Alert, StyleSheet, View } from "react-native";
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

  const [createLike] = useCreateLikeMutation();
  const [createComment] = useCreateCommentMutation();
  const [deleteLike] = useDeleteLikeMutation();

  const { data: postLike } = useGetLikeOfPostQuery({ postId: post?.id });
  const { data: postLikeForCurrentUser } = usePostLikeForCurrentUserQuery({
    postId: post?.id,
    userId: userId || 0,
  });
  const { data: postComments } = useGetCommentOfPostQuery({ postId: post?.id });

  const postComment = postComments?.data;
  const totalComment = postComments?.meta.pagination.total || 0;
  const totalLikes = postLike?.meta.pagination.total || 0;
  const postDescription = post.attributes.description;
  const postUserName = post.attributes.user.data.attributes.username;
  const postAt = formatDistanceToNow(new Date(post.attributes.createdAt), {
    addSuffix: true,
  });
  const postUserId = post.attributes.user.data.id;
  const postId = post.id;

  const likedPostForCurrentUser =
    postLikeForCurrentUser?.meta.pagination.total !== 0;
  const postLikeForCurrentUserId = postLikeForCurrentUser?.data[0]?.id;

  const handleLikeUnlickClick = async () => {
    if (!userId) {
      return Alert.alert("Info", "Please login first to like this post");
    }

    if (likedPostForCurrentUser && postLikeForCurrentUserId) {
      try {
        const result = await deleteLike({ postLikeForCurrentUserId });
        if (!result) {
          Alert.alert("Error", "Something went wrong, try again later");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong, try again later");
      }
    } else if (!likedPostForCurrentUser) {
      try {
        const result = await createLike({
          data: { user: userId, post: postId },
        });
        if (!result) {
          Alert.alert("Error", "Something went wrong, try again later");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong, try again later");
      }
    }
  };

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
          <PostActions
            totalLikes={totalLikes}
            likedPostForCurrentUser={likedPostForCurrentUser}
            handleLikeUnlickClick={handleLikeUnlickClick}
            totalComment={totalComment}
            userId={userId}
          />
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
    margin: 10,
    // backgroundColor: "#f9f9f9",
    borderWidth: 0.2,
    marginBottom: 16,
    borderRadius: 10,
  },
  postContainer: {
    flexGrow: 1,
  },
  postCard: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // padding: 16,
    // marginBottom: 10,
  },
});

export default SinglePost;
