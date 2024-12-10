import { createSlice } from "@reduxjs/toolkit";
type User = {
  id: number;
  email: string;
  startup?: {
    id: number;
    slug: string;
    name: string;
    profile_picture: string;
  };
  investor?: {
    id: number;
    slug: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  resetpassword?: {
    password: string;
    user: User | null;
  };
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initAuth(state) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      } else {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      }
    },

    login(state, action) {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;

      localStorage.setItem(
        "adminPanel_accessToken",
        action.payload.access_token
      );
      localStorage.setItem(
        "adminPanel_refreshToken",
        action.payload.refresh_token
      );
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("adminPanel_accessToken");
      localStorage.removeItem("adminPanel_refreshToken");
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      localStorage.setItem("adminPanel_accessToken", action.payload);
    },
  },
});

export default authSlice.reducer;

export const { login, logout, setAccessToken, initAuth } = authSlice.actions;
