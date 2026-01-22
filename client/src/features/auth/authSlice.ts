import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import client from "../../api/client";
import type { AuthData } from "../../types";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Check localStorage for existing session
const token = localStorage.getItem("token");
const userStr = localStorage.getItem("user");
const user = userStr ? JSON.parse(userStr) : null;

const initialState: AuthState = {
  user: user,
  token: token,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: AuthData, { rejectWithValue }) => {
    try {
      const response = await client.post("/auth/register", userData);
      // Auto login after register or just return user?
      // Usually register returns success, then user logs in.
      // Or backend returns token. My backend register returns { id, username } only.
      return response.data;
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        return rejectWithValue(
          (err as { response: { data: { message: string } } }).response?.data
            ?.message || "Registration failed",
        );
      }
      return rejectWithValue("Registration failed");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData: AuthData, { rejectWithValue }) => {
    try {
      const response = await client.post("/auth/login", userData);
      return response.data; // { token, user }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        return rejectWithValue(
          (err as { response: { data: { message: string } } }).response?.data
            ?.message || "Login failed",
        );
      }
      return rejectWithValue("Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // User needs to login now, or we can auto-login if backend returned token.
        // My backend register doesn't return token.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.isLoading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
