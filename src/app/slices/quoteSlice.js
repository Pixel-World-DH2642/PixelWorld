// quoteSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomQuote } from "../../api/quoteAPI";

const initialState = {
  currentQuote: {
    content: null,
    author: null,
  },
  timestamp: null,
  status: "idle",
  error: null,
};

export const fetchDailyQuote = createAsyncThunk(
  "quote/fetchDailyQuote",
  async (userId) => {
    // 1. Check in Firebase if we have a stored quote for this user and day.
    // 2. If not, fetch a new random quote from your random-quote API,
    //    store it in Firebase with { quote, timestamp, userId }
    // 3. Return { quote, timestamp }

    // We ignore the firebase stuff for now and I'm not sure about the userId
    return await getRandomQuote();
  },
);

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyQuote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDailyQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentQuote = action.payload.quote;
        state.timestamp = action.payload.timestamp;
      })
      .addCase(fetchDailyQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default quoteSlice.reducer;
