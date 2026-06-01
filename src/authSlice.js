import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cart-auth-user";

const readSavedUser = () => {
  try {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: readSavedUser(),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthPending: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setAuthSuccess: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    setAuthFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload || "Authentication failed";
    },
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuthPending,
  setAuthSuccess,
  setAuthFailure,
  logout,
  clearAuthError,
} = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
