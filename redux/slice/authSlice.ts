import { UserData } from "@/types/contantType";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  userInfo: UserData | null; // Use UserData type here
  authToken: string | null;
} = {
  userInfo: null,
  authToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    storeAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    removeAuthToken: (state) => {
      state.authToken = null;
    },
  },
});

export const { storeAuthToken, storeUserInfo, removeAuthToken } =
  authSlice.actions;
