// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";
// ** Reducers
import authSlice from "./slices/authSlice";
import { api } from "@/services/api";


export const store = configureStore({
  reducer: {
    auth: authSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
