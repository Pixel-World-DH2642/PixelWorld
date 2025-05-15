import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const fetchPaintingById = createAsyncThunk(
  "detail/fetchPaintingById",
  async (paintingId, thunkAPI) => {
    try {
      const paintingDoc = doc(db, "paintings", paintingId);
      const paintingSnapshot = await getDoc(paintingDoc);

      if (!paintingSnapshot.exists()) {
        throw new Error("Painting not found");
      }

      const data = paintingSnapshot.data();

      // Convert Firestore Timestamp objects to serializable format
      const serializedData = Object.entries(data).reduce(
        (acc, [key, value]) => {
          // Check if the value is a Timestamp
          if (value && typeof value.toDate === "function") {
            // Convert to ISO string or timestamp number
            acc[key] = value.toDate().toISOString();
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {},
      );

      return {
        id: paintingSnapshot.id,
        ...serializedData,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deletePainting = createAsyncThunk(
  "detail/deletePainting",
  async ({ paintingId, userId }, thunkAPI) => {
    try {
      // First, get the painting to verify ownership
      const paintingDoc = doc(db, "paintings", paintingId);
      const paintingSnapshot = await getDoc(paintingDoc);

      if (!paintingSnapshot.exists()) {
        throw new Error("Painting not found");
      }

      const paintingData = paintingSnapshot.data();

      // Check if the current user is the author of the painting
      if (paintingData.userId !== userId) {
        throw new Error("Unauthorized: You can only delete your own paintings");
      }

      // If authorized, delete the painting
      await deleteDoc(paintingDoc);

      return paintingId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  currentPaintingId: null,
  currentPainting: null,
  isLoading: false,
  error: null,
};

const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setCurrentPaintingId: (state, action) => {
      state.currentPaintingId = action.payload;
    },
    setPainting: (state, action) => {
      state.currentPainting = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaintingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaintingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPainting = action.payload;
      })
      .addCase(fetchPaintingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.currentPainting = null;
      })
      .addCase(deletePainting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePainting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPainting = null;
        state.currentPaintingId = null;
      })
      .addCase(deletePainting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPaintingId, setPainting } = detailSlice.actions;
export default detailSlice.reducer;
