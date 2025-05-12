import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const fetchUserPaintings = createAsyncThunk(
  "painting/fetchUserPaintings",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("No user ID provided");
      }

      const paintingsRef = collection(db, "paintings");
      const q = query(paintingsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const userPaintings = [];
      querySnapshot.forEach((doc) => {
        const paintingData = doc.data();

        // Validate and normalize the colorMatrix data
        let normalizedColorMatrix = paintingData.colorMatrix;

        // Log the raw data for debugging
        console.log("Raw painting data:", paintingData);
        console.log("ColorMatrix type:", typeof paintingData.colorMatrix);

        // If colorMatrix is a string (perhaps JSON), try to parse it
        if (typeof paintingData.colorMatrix === "string") {
          try {
            normalizedColorMatrix = JSON.parse(paintingData.colorMatrix);
          } catch (e) {
            console.error("Failed to parse colorMatrix string:", e);
          }
        }

        // Ensure it's actually an array of arrays
        if (!Array.isArray(normalizedColorMatrix)) {
          normalizedColorMatrix = []; // Default to empty if not an array
        }

        userPaintings.push({
          id: doc.id,
          ...paintingData,
          colorMatrix: normalizedColorMatrix,
        });
      });

      console.log("Processed user paintings:", userPaintings);
      return userPaintings;
    } catch (error) {
      console.error("Error fetching user paintings:", error);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  userPaintings: [],
  userPaintingsStatus: "idle",
  userPaintingsError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPaintings.pending, (state) => {
        state.userPaintingsStatus = "loading";
      })
      .addCase(fetchUserPaintings.fulfilled, (state, action) => {
        state.userPaintingsStatus = "succeeded";
        state.userPaintings = action.payload;
      })
      .addCase(fetchUserPaintings.rejected, (state, action) => {
        state.userPaintingsStatus = "failed";
        state.userPaintingsError = action.payload;
      });
  },
});

export default profileSlice.reducer;
