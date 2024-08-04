import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTask: "video",
};

export const taskSlice = createSlice({
  name: "taskSlice",
  initialState,
  reducers: {
    storeCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
  },
});

export const { storeCurrentTask } = taskSlice.actions;
