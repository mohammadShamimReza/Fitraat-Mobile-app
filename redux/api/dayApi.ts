import { DayData } from "@/types/contantType";
import { baseApi } from "./baseApi";

const DAYS = "/days";

export const daysApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDaysByDayId: builder.query<DayData, number>({
      query: (id: number) =>
        `${DAYS}?filters[DayId][$eq]=${id}&populate[0]=video&populate[1]=kegel.kegel_times&populate[2]=sort_note&populate[3]=blog&populate[4]=quizzes`,
      transformResponse: (rawResult: DayData) => {
        return rawResult;
      },
    }),
  }),
});

export const { useGetDaysByDayIdQuery } = daysApi;
