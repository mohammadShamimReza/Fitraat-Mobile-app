import { Error, UserData, UserDataWithDay } from "@/types/contantType";
import { baseApi } from "./baseApi";

const AUTH = "/auth/local";

export const daysApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: `${AUTH}/register`,
        method: "POST",
        body,
      }),
      transformResponse: (rawResult: UserData | Error) => {
        return rawResult;
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return baseQueryReturnValue.data;
      },
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: `${AUTH}`,
        method: "POST",
        body,
      }),
      transformResponse: (rawResult: UserData | Error) => {
        return rawResult;
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return baseQueryReturnValue.data;
      },
    }),
    getUserInfo: builder.query<UserDataWithDay, void>({
      query: () => ({
        url: `users/me`,
      }),
      transformResponse: (rawResult: UserDataWithDay) => {
        return rawResult;
      },
      providesTags: ["updateUserDay", "updateUser"],
    }),
    updateUserDay: builder.mutation({
      query: (body) => ({
        url: `users/${body.userId}`,
        method: "PUT",
        body: {
          currentDay: body.currentDay,
          compliteDay: body.compliteDay,
        },
      }),
      transformResponse: (rawResult: UserData | Error) => {
        return rawResult;
      },
      invalidatesTags: ["updateUserDay"],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return baseQueryReturnValue.data;
      },
    }),
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: `auth/forgot-password`,
        method: "POST",
        body: {
          email: body.email,
        },
      }),
      transformResponse: (rawResult: any | Error) => {
        return rawResult;
      },
    }),
    chengePassword: builder.mutation({
      query: (body) => ({
        url: `auth/chenge-password`,
        method: "POST",
        body: {
          email: body.email,
        },
      }),
      transformResponse: (rawResult: any | Error) => {
        return rawResult;
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserInfoQuery,
  useUpdateUserDayMutation,
  useForgetPasswordMutation,
  useChengePasswordMutation,
} = daysApi;
