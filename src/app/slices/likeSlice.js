import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// Toggle like
export const toggleLike = createAsyncThunk(
  "likes/toggleLike",
  async ({ paintingId, userId }, thunkAPI) => {
    if (!userId || !paintingId) {
      return thunkAPI.rejectWithValue("User or painting ID missing");
    }

    try {
      // Check if the user already liked this painting
      const likesQuery = query(
        collection(db, "likes"),
        where("paintingId", "==", paintingId),
        where("userId", "==", userId),
      );
      const snapshot = await getDocs(likesQuery);

      // If already liked, remove the like
      if (!snapshot.empty) {
        const likeDoc = snapshot.docs[0];
        await deleteDoc(doc(db, "likes", likeDoc.id));
        return { liked: false };
      }

      // Otherwise, add a new like
      await addDoc(collection(db, "likes"), {
        paintingId,
        userId,
        timestamp: serverTimestamp(),
      });
      return { liked: true };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  count: 0,
  userLiked: false,
  loading: false,
  error: null,
};

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    resetLikes: () => initialState,
    // Add actions for real-time updates
    updateLikesCount: (state, action) => {
      state.count = action.payload;
    },
    updateUserLikeStatus: (state, action) => {
      state.userLiked = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle like
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.userLiked = action.payload.liked;
        state.loading = false;
        // Note: We don't update count here because the listener will handle it
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetLikes, updateLikesCount, updateUserLikeStatus } =
  likeSlice.actions;
export default likeSlice.reducer;
