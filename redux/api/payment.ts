import { baseApi } from "./baseApi";

const PAYMENT = "/payment";
export const paymentAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paymentInit: builder.mutation({
      query: (body: any) => ({
        url: `${PAYMENT}/init`,
        method: "POST",
        body: body,
        transformResponse: (rawResult: { url: string; response: any }) => {
          return rawResult;
        },
      }),
    }),
  }),
});

export const { usePaymentInitMutation } = paymentAPi;
