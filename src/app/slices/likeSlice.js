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
        await thunkAPI.dispatch(fetchLikesCount(paintingId)); // Update likes count
        return { liked: false, userId, paintingId };
      }

      // Otherwise, add a new like
      await addDoc(collection(db, "likes"), {
        paintingId,
        userId,
        timestamp: serverTimestamp(),
      });
      await thunkAPI.dispatch(fetchLikesCount(paintingId)); // Update likes count
      return { liked: true, userId, paintingId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchUserLikes = createAsyncThunk(
  "likes/fetchUserLikes",
  async (userId, thunkAPI) => {
    if (!userId) {
      return thunkAPI.rejectWithValue("User ID missing");
    }

    try {
      const likesQuery = query(
        collection(db, "likes"),
        where("userId", "==", userId),
      );
      const snapshot = await getDocs(likesQuery);

      // Return a set of painting IDs that the user has liked
      const userLikes = new Set();
      snapshot.docs.forEach((doc) => {
        const likeData = doc.data();
        userLikes.add(likeData.paintingId);
      });

      return Array.from(userLikes);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchLikesCount = createAsyncThunk(
  "likes/fetchLikesCount",
  async (paintingId, thunkAPI) => {
    try {
      if (!paintingId) {
        return thunkAPI.rejectWithValue("No painting ID provided");
      }

      // Query Firebase for likes with this paintingId
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("paintingId", "==", paintingId));
      const snapshot = await getDocs(q);

      // Return the count and paintingId
      return {
        paintingId,
        count: snapshot.size,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  userLikedPaintings: [], // Store only the IDs of paintings the user has liked
  loading: false,
  error: null,
};

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    resetLikes: () => initialState,
    setUserLikedPaintings: (state, action) => {
      state.userLikedPaintings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle like
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = false;
        // Update the user's liked paintings list
        const { liked, paintingId } = action.payload;
        if (liked) {
          if (!state.userLikedPaintings.includes(paintingId)) {
            state.userLikedPaintings.push(paintingId);
          }
        } else {
          state.userLikedPaintings = state.userLikedPaintings.filter(
            (id) => id !== paintingId,
          );
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch user likes
      .addCase(fetchUserLikes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        state.userLikedPaintings = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserLikes.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch likes count
      .addCase(fetchLikesCount.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchLikesCount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetLikes, setUserLikedPaintings } = likeSlice.actions;
export default likeSlice.reducer;
