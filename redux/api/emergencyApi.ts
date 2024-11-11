import { Emergencys } from "@/types/contantType";
import { baseApi } from "./baseApi";

const EMERGENCY = "/emergencies";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnergencyContant: builder.query({
      query: () => `${EMERGENCY}`,
      transformResponse: (rawResult: Emergencys) => {
        return rawResult;
      },
    }),
  }),
});

export const { useGetEnergencyContantQuery } = blogApi;
