import { getTokenFromSecureStore } from "@/lib/auth/token";
import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define a base query with token support
const baseQueryWithToken = fetchBaseQuery({
  baseUrl:
    // "https://detox-dopamine-backend.onrender.com/api" ||
    // "http://localhost:1337/api", ||
    "http://10.0.2.2:1337/api",

  prepareHeaders: async (
    headers: Headers,
    api: Pick<BaseQueryApi, "getState">
  ) => {
    // Correctly type and access getState
    const { getState } = api;
    const state = getState() as RootState;

    const stateToken = state.auth.authToken;
    const token = stateToken || (await getTokenFromSecureStore());

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create the base API with defined endpoints and tag types
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithToken,
  endpoints: () => ({}),
  tagTypes: [
    "updateUserDay",
    "updateUser",
    "createPost",
    "deletePost",
    "createLike",
    "deleteLike",
    "createComment",
    "updateComment",
    "deleteComment",
  ],
});