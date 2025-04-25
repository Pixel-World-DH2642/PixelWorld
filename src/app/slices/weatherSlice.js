import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeatherData } from "../../api/smhiWeatherAPI";

const initialState = {
  weatherData: null,
  timestamp: null,
  status: "idle",
  error: null,
};

export const getWeatherData = createAsyncThunk(
  "weather/getWeatherData",
  async () => {
    //longitude & latitude hardcoded for now
    //will use navigator.geolocation to get coords
    return await fetchWeatherData(18.06324, 59.334591);
  },
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getWeatherData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.weatherData = action.payload;
        state.timestamp = action.payload.timestamp;
      })
      .addCase(getWeatherData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
