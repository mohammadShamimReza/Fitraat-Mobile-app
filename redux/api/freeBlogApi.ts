import { BlogData, SingleBlogData } from "@/types/contantType";
import { baseApi } from "./baseApi";

const BLOG = "/free-blogs";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFreeBlogs: builder.query({
      query: (body: {
        searchTerm: string;
        pageCount: number;
        paginationSize: number;
      }) =>
        `${BLOG}?filters[title][$containsi]=${body.searchTerm}&pagination[page]=${body.pageCount}&pagination[pageSize]=${body.paginationSize}`,
      transformResponse: (rawResult: BlogData) => {
        return rawResult;
      },
    }),
    getFreeBlogsById: builder.query({
      query: (id: string) =>
        `${BLOG}/${id}?fields[0]=title&fields[1]=content&fields[2]=imageURL&fields[3]=viewCount&fields[4]=authorName`,
      transformResponse: (rawResult: SingleBlogData) => {
        return rawResult;
      },
    }),
    get3TrendingFreeBlog: builder.query({
      query: () =>
        `${BLOG}?sort[0]=viewCount:desc&fields[0]=title&fields[1]=content&fields[2]=imageURL&fields[3]=viewCount&pagination[page]=1&pagination[pageSize]=3`,
      transformResponse: (rawResult: BlogData) => {
        return rawResult;
      },
    }),
    updateFreeBlog: builder.mutation({
      query: ({
        id,
        updatedFields,
      }: {
        id: number;
        updatedFields: Partial<{ viewCount: number }>;
      }) => ({
        url: `${BLOG}/${id}`,
        method: "PUT",
        body: {
          data: updatedFields,
        },
      }),
    }),
  }),
});

export const {
  useGetFreeBlogsQuery,
  useGetFreeBlogsByIdQuery,
  useGet3TrendingFreeBlogQuery,
  useUpdateFreeBlogMutation,
} = blogApi;
