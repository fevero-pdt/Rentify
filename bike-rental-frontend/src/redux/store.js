import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import bikeReducer from "./bikeSlice";
import bookingReducer from "./bookingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bikes: bikeReducer,
    bookings: bookingReducer,
  },
});
