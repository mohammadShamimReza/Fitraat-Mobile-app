import {
  CreateCommentForPost,
  Post,
  PostData,
  postForCommentData,
} from "@/types/contantType";
import { baseApi } from "./baseApi";

const COMMENT = "/post-comments";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (body) => ({
        url: `${COMMENT}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["createComment"],
      transformResponse: (rawResult: CreateCommentForPost) => {
        return rawResult;
      },
      // async onQueryStarted(body, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
      //     dispatch(
      //       postApi.util.updateQueryData(
      //         "getCommentOfPost",
      //         { postId: body.data.post },
      //         (draft) => {
      //           draft.meta.pagination.total += 1;
      //           draft.data.push(data.attributes.comment);
      //         }
      //       )
      //     );
      //   } catch {}
      // },
    }),
    deleteComment: builder.mutation({
      query: (data: { postId: number }) => ({
        url: `${COMMENT}/${data.postId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["deleteComment"],
      transformResponse: (rawResult: Post) => {
        return rawResult;
      },
      // async onQueryStarted(data, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data: responseData } = await queryFulfilled;
      //     dispatch(
      //       postApi.util.updateQueryData(
      //         "getCommentOfPost",
      //         { postId: responseData.id },
      //         (draft) => {
      //           draft.meta.pagination.total -= 1;
      //           draft.data = draft.data.filter(
      //             (like) => like.id !== responseData.id
      //           );
      //         }
      //       )
      //     );
      //   } catch {}
      // },
    }),
    getCommentOfPost: builder.query({
      query: (data: { postId: number }) => ({
        url: `${COMMENT}?sort[0]=updatedAt:desc&populate[0]=user&populate[1]=post&filters[post][id][$eq]=${data.postId}`,
        method: "GET",
      }),
      providesTags: ["createComment", "deleteComment", "updateComment"],
      transformResponse: (rawResult: postForCommentData) => {
        return rawResult;
      },
    }),
    updateComment: builder.mutation({
      query: (data: { commentId: number; data: { comment: string } }) => ({
        url: `${COMMENT}/${data.commentId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["updateComment"],
      transformResponse: (rawResult: PostData) => {
        return rawResult;
      },
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentOfPostQuery,
  useUpdateCommentMutation,
} = postApi;
