import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchPaintings = createAsyncThunk(
  "museum/fetchPaintings",
  async (_, thunkAPI) => {
    try {
      // Get paintings
      const paintingsCollection = collection(db, "paintings");
      const paintingsSnapshot = await getDocs(paintingsCollection);

      // Get likes
      const likesCollection = collection(db, "likes");
      const likesSnapshot = await getDocs(likesCollection);

      // Count likes per painting
      const likesCount = {};
      likesSnapshot.docs.forEach(doc => {
        const like = doc.data();
        likesCount[like.paintingId] = (likesCount[like.paintingId] || 0) + 1;
      });

      // Process paintings with timestamp serialization and add likes count
      const paintings = paintingsSnapshot.docs.map((doc) => {
        const data = doc.data();

        // Timestamp serialization
        const serializedData = Object.entries(data).reduce(
          (acc, [key, value]) => {
            if (value && typeof value.toDate === "function") {
              acc[key] = value.toDate().toISOString();
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {},
        );

        // Add the likes count to the painting data
        return {
          id: doc.id,
          ...serializedData,
          likesCount: likesCount[doc.id] || 0
        };
      });

      // Sort paintings by likes count
      const sortedPaintings = paintings.sort((a, b) => b.likesCount - a.likesCount);

      return sortedPaintings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  paintings: [],
  selectedPaintingId: null,
  startIndex: 0,
  paintingsPerPage: 3,
  isLoading: false,
  error: null,
};

export const museumSlice = createSlice({
  name: "museum",
  initialState,
  reducers: {
    setPaintings: (state, action) => {
      state.paintings = action.payload;
    },
    selectPainting: (state, action) => {
      state.selectedPaintingId = action.payload;
    },
    nextPaintings: (state) => {
      if (state.startIndex + state.paintingsPerPage < state.paintings.length) {
        state.startIndex += state.paintingsPerPage;
      }
    },
    prevPaintings: (state) => {
      if (state.startIndex > 0) {
        state.startIndex -= state.paintingsPerPage;
      }
    },
    setStartIndex: (state, action) => {
      state.startIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaintings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaintings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paintings = action.payload;
      })
      .addCase(fetchPaintings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setPaintings,
  selectPainting,
  nextPaintings,
  prevPaintings,
  setStartIndex,
} = museumSlice.actions;

export default museumSlice.reducer;
