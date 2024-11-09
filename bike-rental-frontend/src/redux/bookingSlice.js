import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

// Thunk to fetch bookings for the logged-in user
export const fetchBookings = createAsyncThunk("bookings/fetchBookings", async () => {
  const { data } = await API.get("/bookings");
  return data;
});

// Thunk to create a new booking
export const createBooking = createAsyncThunk("bookings/createBooking", async (bookingData) => {
  const { data } = await API.post("/bookings", bookingData);
  return data;
});

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    list: [],       // Stores user's bookings
    status: "idle", // Tracks API call status
    error: null,    // Stores error messages
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default bookingSlice.reducer;
