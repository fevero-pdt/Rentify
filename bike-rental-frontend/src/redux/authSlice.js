import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; // Adjust the import according to your structure

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
  } catch (error) {
      // If the error response has a message, return it, otherwise return a generic message
      return rejectWithValue(error.response ? error.response.data.message : "Login failed");
  }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null; // Reset any errors
        },
        // Other reducers can go here
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload; // Handle the error
            });
    },
});

// Export the logout action
export const { logout } = authSlice.actions;

export default authSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../api";

// export const login = createAsyncThunk("auth/login", async (credentials) => {
//   const { data } = await API.post("/auth/login", credentials);
//   localStorage.setItem("token", data.token);
//   return data.token;
// });

// export const authSlice = createSlice({
//   name: "auth",
//   initialState: { token: localStorage.getItem("token") || null },
//   reducers: { logout: (state) => { state.token = null; localStorage.removeItem("token"); } },
//   extraReducers: (builder) => {
//     builder.addCase(login.fulfilled, (state, action) => { state.token = action.payload; });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
