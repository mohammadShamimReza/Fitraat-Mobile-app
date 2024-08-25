import { Post, PostData } from "@/types/contantType";
import { baseApi } from "./baseApi";

const POST = "/posts";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (body) => ({
        url: `${POST}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["createPost"],
      transformResponse: (rawResult: Post) => {
        return rawResult;
      },
    }),
    getPost: builder.query({
      query: (body: { pageCount: number }) => ({
        url: `${POST}?sort[0]=updatedAt:desc&populate[0]=user&pagination[page]=${body.pageCount}&pagination[pageSize]=3`,
        method: "GET",
      }),
      providesTags: ["createPost", "deletePost"],
      transformResponse: (rawResult: PostData) => {
        return rawResult;
      },
    }),
    updatePost: builder.mutation({
      query: ({ body }) => ({
        url: `${POST}/${body.postId}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["createPost"],
      transformResponse: (rawResult: Post) => {
        return rawResult;
      },
    }),
    getPostsByUserId: builder.query({
      query: (body: { userId: number }) => ({
        url: `${POST}?sort[0]=updatedAt:desc&populate[0]=user&filters[user][id][$eq]=${body.userId}`,
        method: "GET",
      }),
      providesTags: ["createPost", "deletePost"],
      transformResponse: (rawResult: PostData) => {
        return rawResult;
      },
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `${POST}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["deletePost"],
      transformResponse: (rawResult: Post) => {
        return rawResult;
      },
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useGetPostsByUserIdQuery,
  useDeletePostMutation,
} = postApi;
