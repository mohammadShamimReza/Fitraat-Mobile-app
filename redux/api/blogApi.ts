import { SingleBlogData } from "@/types/contantType";
import { baseApi } from "./baseApi";

const BLOG = "/blogs";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogsById: builder.query({
      query: (id: string) =>
        `${BLOG}/${id}?fields[0]=title&fields[1]=content&fields[2]=imageURL&fields[3]=viewCount`,
      transformResponse: (rawResult: SingleBlogData) => {
        return rawResult;
      },
    }),
  }),
});

export const { useGetBlogsByIdQuery } = blogApi;
