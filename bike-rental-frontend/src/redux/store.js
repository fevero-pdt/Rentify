import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import bikeReducer from "./bikeSlice";
import bookingReducer from "./bookingSlice";
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bikes: bikeReducer,
    bookings: bookingReducer,
    user: userReducer,
  },
});
