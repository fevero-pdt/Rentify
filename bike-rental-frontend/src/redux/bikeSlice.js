import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const fetchBikes = createAsyncThunk("bikes/fetchBikes", async () => {
  const { data } = await API.get("/bikes");
  return data;
});


const bikeSlice = createSlice({
  name: "bikes",
  initialState: [],
  reducers: {
    addBike: (state, action) => {
      state.push(action.payload);
    },
    deleteBike: (state, action) => {
      return state.filter(bike => bike.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBikes.fulfilled, (state, action) => { state.list = action.payload; });
  },
});

export const { addBike, deleteBike } = bikeSlice.actions;

export default bikeSlice.reducer;
