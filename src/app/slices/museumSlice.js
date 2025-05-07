import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from '../firebase'; // Adjust path if needed
import { collection, getDocs } from "firebase/firestore";

// Thunk to fetch paintings from Firestore
export const fetchPaintings = createAsyncThunk(
  'museum/fetchPaintings',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'paintings'));
    const paintings = querySnapshot.docs.map(doc => ({
      id: doc.id, // use Firestore doc ID
      ...doc.data()
    }));
    return paintings;
  }
);

const initialState = {
  paintings: [],
  selectedPaintingId: null,
  startIndex: 0,
  paintingsPerPage: 3,
  status: 'idle', // 'loading' | 'succeeded' | 'failed'
  error: null
};

export const museumSlice = createSlice({
  name: 'museum',
  initialState,
  reducers: {
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaintings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPaintings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paintings = action.payload;
      })
      .addCase(fetchPaintings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export actions
export const { selectPainting, nextPaintings, prevPaintings } = museumSlice.actions;

// Selectors
export const selectAllPaintings = (state) => state.museum.paintings;
export const selectCurrentPaintings = (state) => {
  const { paintings, startIndex, paintingsPerPage } = state.museum;
  return paintings.slice(startIndex, startIndex + paintingsPerPage);
};
export const selectIsFirstPage = (state) => state.museum.startIndex === 0;
export const selectIsLastPage = (state) => {
  const { startIndex, paintingsPerPage, paintings } = state.museum;
  return startIndex + paintingsPerPage >= paintings.length;
};
export const selectMuseumStatus = (state) => state.museum.status;
export const selectMuseumError = (state) => state.museum.error;

export default museumSlice.reducer;
