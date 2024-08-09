// store/slice/refetchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const refetchSlice = createSlice({
  name: "refetch",
  initialState: false,
  reducers: {
    triggerRefetch: (state) => !state,
  },
});

export const { triggerRefetch } = refetchSlice.actions;
