import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import { authSlice } from "./slice/authSlice";
import { initialRenderSlice } from "./slice/initialRenderSlice";
import { triggerRefetch } from "./slice/refetchSlice";
import { taskSlice } from "./slice/taskSlice";

export const reducer = combineReducers({
  auth: authSlice.reducer,
  taskSlice: taskSlice.reducer,
  initialRenderSlice: initialRenderSlice.reducer,
  refetch: triggerRefetch,
  [baseApi.reducerPath]: baseApi.reducer,
});
