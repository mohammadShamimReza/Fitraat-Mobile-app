import { getTokenFromSecureStore } from "@/lib/auth/token";
import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const backendUrl = process.env.EXPO_PUBLIC_BackendUrl;

// Define a base query with token support
const baseQueryWithToken = fetchBaseQuery({
  baseUrl: `${backendUrl}/api`,

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
    "deleteLike",
    "createComment",
    "updateComment",
    "deleteComment",
  ],
});
