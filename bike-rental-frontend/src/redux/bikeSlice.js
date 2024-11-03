import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const fetchBikes = createAsyncThunk("bikes/fetchBikes", async () => {
  const { data } = await API.get("/bikes");
  return data;
});

export const bikeSlice = createSlice({
  name: "bikes",
  initialState: { list: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBikes.fulfilled, (state, action) => { state.list = action.payload; });
  },
});

export default bikeSlice.reducer;
