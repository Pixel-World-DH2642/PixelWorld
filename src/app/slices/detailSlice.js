import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { doc, getDoc } from "firebase/firestore";
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
    likePainting: (state, action) => {
      if (!state.currentPainting.likedBy.includes(action.payload)) {
        state.currentPainting.likedBy.push(action.payload);
      }
    },
    dislikePainting: (state, action) => {
      state.currentPainting.likedBy = state.currentPainting.likedBy.filter(
        (user) => user !== action.payload,
      );
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
      });
  },
});

export const {
  setCurrentPaintingId,
  setPainting,
  likePainting,
  dislikePainting,
} = detailSlice.actions;
export default detailSlice.reducer;
