import { CreateLikeForPost, Post, PostData } from "@/types/contantType";
import { baseApi } from "./baseApi";

const LIKE = "/post-likes";

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLike: builder.mutation({
      query: (body) => ({
        url: `${LIKE}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["createLike"],
      transformResponse: (rawResult: CreateLikeForPost) => {
        return rawResult;
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            likeApi.util.updateQueryData(
              "getLikeOfPost",
              { postId: body.data.post },
              (draft) => {
                draft.meta.pagination.total += 1;
                // draft.data.push(data);
              }
            )
          );
        } catch {}
      },
    }),
    deleteLike: builder.mutation({
      query: (data: { postLikeForCurrentUserId: number }) => ({
        url: `${LIKE}/${data.postLikeForCurrentUserId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["deleteLike"],
      transformResponse: (rawResult: Post) => {
        return rawResult;
      },
      async onQueryStarted(data, { dispatch, queryFulfilled }) {
        try {
          const { data: responseData } = await queryFulfilled;
          dispatch(
            likeApi.util.updateQueryData(
              "getLikeOfPost",
              { postId: responseData.id },
              (draft) => {
                draft.meta.pagination.total -= 1;
                draft.data = draft.data.filter(
                  (like) => like.id !== responseData.id
                );
              }
            )
          );
        } catch {}
      },
    }),
    getLikeOfPost: builder.query({
      query: (data: { postId: number }) => ({
        url: `${LIKE}?populate[0]=user&populate[1]=post&filters[post][id][$eq]=${data.postId}`,
        method: "GET",
      }),
      providesTags: ["createLike", "deleteLike"],
      transformResponse: (rawResult: PostData) => {
        return rawResult;
      },
    }),
    postLikeForCurrentUser: builder.query({
      query: (data: { postId: number; userId: number }) => ({
        url: `${LIKE}?populate[0]=user&filters[user][id][$eq]=${data.userId}&populate[1]=post&filters[post][id][$eq]=${data.postId}`,
        method: "GET",
      }),
      providesTags: ["createLike", "deleteLike"],
      transformResponse: (rawResult: PostData) => {
        return rawResult;
      },
    }),
  }),
});

export const {
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useGetLikeOfPostQuery,
  usePostLikeForCurrentUserQuery,
} = likeApi;
