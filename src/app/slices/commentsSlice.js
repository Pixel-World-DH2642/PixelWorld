import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

// Async thunk for adding a comment
export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    { paintingId, userId, userName, text },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const commentsRef = collection(db, "comments");
      const newComment = {
        paintingId,
        authorId: userId,
        authorName: userName,
        text,
        timestamp: Date.now(),
      };

      const docRef = await addDoc(commentsRef, newComment);

      return { id: docRef.id, ...newComment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId, paintingId }, { rejectWithValue, dispatch }) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getSortedComments = createSelector(
  (state) => state.comments.items,
  (comments) => {
    // Sort by timestamp in descending order (newest first)
    return [...comments].sort((a, b) => b.timestamp - a.timestamp);
  },
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    addLiveComment: (state, action) => {
      // Only add if not already present (to prevent duplicates)
      const exists = state.items.find(
        (comment) => comment.id === action.payload.id,
      );
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    updateLiveComment: (state, action) => {
      const index = state.items.findIndex(
        (comment) => comment.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeLiveComment: (state, action) => {
      state.items = state.items.filter(
        (comment) => comment.id !== action.payload,
      );
    },
    clearComments: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addComment.rejected, (state, action) => {
        console.error("Failed to add comment:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        console.error("Failed to delete comment:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  addLiveComment,
  updateLiveComment,
  removeLiveComment,
  clearComments,
} = commentsSlice.actions;

export default commentsSlice.reducer;
