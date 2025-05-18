import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomQuote } from "../../api/quoteAPI";
import { db } from "../firebase"; // Assuming your firebase config is here
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

// Constants
const DAILY_QUOTE_LIMIT = 2;

// Helper function to check if it's a new day
const isNewDay = (lastTimestamp) => {
  if (!lastTimestamp) return true;

  const lastDate = new Date(lastTimestamp);
  const currentDate = new Date();

  return (
    lastDate.getDate() !== currentDate.getDate() ||
    lastDate.getMonth() !== currentDate.getMonth() ||
    lastDate.getFullYear() !== currentDate.getFullYear()
  );
};

const initialState = {
  currentQuote: {
    content: null,
    author: null,
  },
  timestamp: null,
  status: "idle",
  error: null,
  quotesRemaining: DAILY_QUOTE_LIMIT,
  lastFetchTimestamp: null,
};

// Thunk to fetch user's quote data from Firebase
export const checkUserQuoteData = createAsyncThunk(
  "quote/checkUserQuoteData",
  async (userId, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("No user ID provided");

    try {
      const userQuoteRef = doc(db, "userQuotes", userId);
      const userQuoteDoc = await getDoc(userQuoteRef);

      if (userQuoteDoc.exists()) {
        const data = userQuoteDoc.data();

        // Check if it's a new day to reset the counter
        if (
          isNewDay(
            data.lastFetchTimestamp?.toDate?.() || data.lastFetchTimestamp,
          )
        ) {
          return {
            quotesRemaining: DAILY_QUOTE_LIMIT,
            lastFetchTimestamp: null,
            currentQuote: data.currentQuote || null,
          };
        }

        return {
          quotesRemaining: data.quotesRemaining || 0,
          lastFetchTimestamp:
            data.lastFetchTimestamp?.toDate?.() || data.lastFetchTimestamp,
          currentQuote: data.currentQuote || null,
        };
      } else {
        // First time user, initialize in Firebase
        await setDoc(userQuoteRef, {
          quotesRemaining: DAILY_QUOTE_LIMIT,
          lastFetchTimestamp: null,
          currentQuote: null,
        });
        return {
          quotesRemaining: DAILY_QUOTE_LIMIT,
          lastFetchTimestamp: null,
          currentQuote: null,
        };
      }
    } catch (error) {
      console.error("Error checking user quote data:", error);
      return rejectWithValue(error.message);
    }
  },
);

export const fetchDailyQuote = createAsyncThunk(
  "quote/fetchDailyQuote",
  async (userId, { getState, rejectWithValue }) => {
    if (!userId) return rejectWithValue("No user ID provided");

    const state = getState();

    // Check if quotes are remaining for today
    if (
      state.quote.quotesRemaining <= 0 &&
      !isNewDay(state.quote.lastFetchTimestamp)
    ) {
      return rejectWithValue("No quotes remaining for today");
    }

    try {
      // Get a new quote
      const quoteData = await getRandomQuote();

      // Update Firebase with decremented count and new quote
      const userQuoteRef = doc(db, "userQuotes", userId);
      await setDoc(
        userQuoteRef,
        {
          quotesRemaining: state.quote.quotesRemaining - 1,
          lastFetchTimestamp: serverTimestamp(),
          currentQuote: quoteData.quote,
        },
        { merge: true },
      );

      return quoteData;
    } catch (error) {
      console.error("Error fetching quote:", error);
      return rejectWithValue(error.message);
    }
  },
);

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Check user quote data cases
      .addCase(checkUserQuoteData.pending, (state) => {
        state.status = "checking";
      })
      .addCase(checkUserQuoteData.fulfilled, (state, action) => {
        state.status = "idle";
        state.quotesRemaining = action.payload.quotesRemaining;
        state.lastFetchTimestamp = action.payload.lastFetchTimestamp;
        if (action.payload.currentQuote) {
          state.currentQuote = action.payload.currentQuote;
        }
      })
      .addCase(checkUserQuoteData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Fetch quote cases
      .addCase(fetchDailyQuote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDailyQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentQuote = action.payload.quote;
        state.timestamp = action.payload.timestamp;
        state.lastFetchTimestamp = Date.now(); // Use local time for display purposes
        state.quotesRemaining -= 1;
        state.error = null;
      })
      .addCase(fetchDailyQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default quoteSlice.reducer;
