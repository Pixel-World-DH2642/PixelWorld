import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

// Async thunk for fetching comments
export const fetchComments = createAsyncThunk(
  "comments/fetchByPaintingId",
  async (paintingId, { rejectWithValue }) => {
    try {
      const commentsRef = collection(db, "comments");
      const q = query(
        commentsRef,
        where("paintingId", "==", paintingId),
        orderBy("timestamp", "desc"),
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

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

      // After adding, fetch all comments again to ensure we have the latest data
      dispatch(fetchComments(paintingId));

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
      // Refresh comments list
      dispatch(fetchComments(paintingId));
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
    clearComments: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        // Only update status to prevent UI jank
        state.status = "loading";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        console.error("Failed to delete comment:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentsSlice.actions;

export default commentsSlice.reducer;
