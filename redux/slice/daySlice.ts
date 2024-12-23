import { Day, DayData, Meta } from "@/types/contantType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DayState {
  data: Day[] | null; // Stores the list of days
  meta: Meta | null; // Stores pagination metadata
  currentDay: Day | null; // Stores the current selected day
}

const initialState: DayState = {
  data: null,
  meta: null,
  currentDay: null,
};

export const daySlice = createSlice({
  name: "daySlice",
  initialState,
  reducers: {
    // Store the full day data
    storeDayData: (state, action: PayloadAction<DayData>) => {
      state.data = action.payload.data;
      state.meta = action.payload.meta;
    },
    // Store a specific current day
    storeCurrentDay: (state, action: PayloadAction<Day>) => {
      state.currentDay = action.payload;
    },
    // Clear all stored day data
    clearDayData: (state) => {
      state.data = null;
      state.meta = null;
      state.currentDay = null;
    },
  },
});

export const { storeDayData, storeCurrentDay, clearDayData } = daySlice.actions;

export default daySlice.reducer;
