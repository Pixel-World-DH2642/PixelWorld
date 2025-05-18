import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeatherData } from "../../api/smhiWeatherAPI";

const initialState = {
  weatherData: null,
  weatherCode: null,
  weatherTemperature: null,
  windSpeed: null,
  airPressure: null,
  meanPrecipitation: null,
  currentWeather: null,
  currentTemperature: null,
  timestamp: null,
  status: "idle",
  error: null,
};

// make it so that it works with geolocation!!
//if the location is different than Sweden -> display default weather
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
        const code = String(action.payload.weatherCode);
        state.weatherCode = code;
        state.weatherData = action.payload;
        state.timestamp = action.payload.timestamp;
        //console.log("weather data is:", action.payload);
        state.parsedData = action.payload.parsedData;

        //edit this line to pass more const as props to worldpage
        state.weatherTemperature = action.payload.weatherTemperature;
        state.windSpeed = action.payload.windSpeed;
        state.airPressure = action.payload.airPressure;
        state.meanPrecipitation = action.payload.meanPrecipitation;

        let currentWeather = null;
        switch (code) {
          case "1":
          case "2":
            currentWeather = "clear sky";
            break;
          case "3":
          case "4":
            currentWeather = "slightly cloudy sky";
            break;
          case "5":
          case "6":
            currentWeather = "cloudy sky";
            break;
          case "7":
            currentWeather = "fog";
            break;
          case "8":
          case "9":
          case "18":
          case "19":
            currentWeather = "light to moderate rain showers";
            break;
          case "10":
          case "20":
            currentWeather = "heavy rain";
            break;
          case "11":
          case "21":
            currentWeather = "heavy rain and thunderstorms";
            break;
          case "12":
          case "13":
          case "14":
          case "22":
          case "23":
          case "24":
            currentWeather = "sleet showers";
            break;
          case "15":
          case "16":
          case "25":
          case "26":
            currentWeather = "light to moderate snow";
            break;
          case "17":
          case "27":
            currentWeather = "heavy snow";
            break;
          default:
            currentWeather = "unknown";
        }
        state.currentWeather = currentWeather;
      })
      .addCase(getWeatherData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
