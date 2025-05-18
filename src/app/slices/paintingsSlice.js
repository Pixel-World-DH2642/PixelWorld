import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// Entity adapter for normalized state management
const paintingsAdapter = createEntityAdapter();

// Helper function to normalize Firestore data
const normalizeFirestoreData = (data) => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    // Handle Firestore Timestamps
    if (value && typeof value.toDate === "function") {
      acc[key] = value.toDate().toISOString();
    }
    // Handle colorMatrix special case
    else if (key === "colorMatrix" && typeof value === "string") {
      try {
        acc[key] = JSON.parse(value);
      } catch (e) {
        console.error("Failed to parse colorMatrix string:", e);
        acc[key] = [];
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Async thunks
export const fetchAllPaintings = createAsyncThunk(
  "paintings/fetchAll",
  async (_, thunkAPI) => {
    try {
      const paintingsCollection = collection(db, "paintings");
      const snapshot = await getDocs(paintingsCollection);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...normalizeFirestoreData(doc.data()),
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchPaintingById = createAsyncThunk(
  "paintings/fetchById",
  async (paintingId, thunkAPI) => {
    try {
      const paintingDoc = doc(db, "paintings", paintingId);
      const snapshot = await getDoc(paintingDoc);

      if (!snapshot.exists()) {
        throw new Error("Painting not found");
      }

      return {
        id: snapshot.id,
        ...normalizeFirestoreData(snapshot.data()),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchUserPaintings = createAsyncThunk(
  "paintings/fetchUserPaintings",
  async (userId, thunkAPI) => {
    try {
      if (!userId) {
        return thunkAPI.rejectWithValue("No user ID provided");
      }

      const paintingsRef = collection(db, "paintings");
      const q = query(paintingsRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...normalizeFirestoreData(doc.data()),
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const uploadPainting = createAsyncThunk(
  "paintings/upload",
  async (paintingData, thunkAPI) => {
    try {
      // Validate required fields
      if (!paintingData.userId || !paintingData.colorMatrix) {
        throw new Error("Missing required fields for painting upload");
      }

      // Prepare data for Firestore - convert colorMatrix to string if it's an array/object
      const firestoreData = {
        ...paintingData,
        colorMatrix:
          Array.isArray(paintingData.colorMatrix) ||
          typeof paintingData.colorMatrix === "object"
            ? JSON.stringify(paintingData.colorMatrix)
            : paintingData.colorMatrix,
        createdAt: serverTimestamp(),
      };

      // Add to Firestore
      const paintingsCollection = collection(db, "paintings");
      const docRef = await addDoc(paintingsCollection, firestoreData);

      // Get the newly created document to return
      const snapshot = await getDoc(docRef);

      // Return normalized data
      return {
        id: snapshot.id,
        ...normalizeFirestoreData(snapshot.data()),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deletePainting = createAsyncThunk(
  "paintings/delete",
  async ({ paintingId, userId }, thunkAPI) => {
    try {
      // Verify ownership
      const paintingDoc = doc(db, "paintings", paintingId);
      const snapshot = await getDoc(paintingDoc);

      if (!snapshot.exists()) {
        throw new Error("Painting not found");
      }

      const data = snapshot.data();
      if (data.userId !== userId) {
        throw new Error("Unauthorized: You can only delete your own paintings");
      }

      // Delete if authorized
      await deleteDoc(paintingDoc);
      return paintingId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// Create the slice with initial state from adapter
const paintingsSlice = createSlice({
  name: "paintings",
  initialState: paintingsAdapter.getInitialState({
    loading: false,
    error: null,
    selectedPaintingId: null,
    currentPainting: null,
    playerPainting: { jagged: null, flat: null },
    undoBuffer: [],
    undoIndex: 0,
  }),
  reducers: {
    selectPainting: (state, action) => {
      state.selectedPaintingId = action.payload;
      const found = state.entities[action.payload];
      if (found) {
        state.currentPainting = found;
      }
    },
    clearSelectedPainting: (state) => {
      state.selectedPaintingId = null;
      state.currentPainting = null;
    },
    updatePlayerPainting: (state, action) => {
      state.undoBuffer.push(state.playerPainting);
      console.log(state.undoBuffer[0]);
      if (state.undoBuffer.length > 30) state.undoBuffer.splice(0, 1);
      state.playerPainting.jagged = action.payload;
      state.playerPainting.flat = action.payload.flat();
    },
    undoEdit: (state) => {
      console.log("m undo");
      state.undoIndex--;
      if (state.undoIndex + state.undoBuffer.length < 0) {
        state.undoIndex++;
        return;
      }
      console.log(state.undoBuffer.length);
      console.log(state.undoIndex);
      console.log(state.undoBuffer[state.undoIndex]);
      state.playerPainting = state.undoBuffer[state.undoIndex];
    },
    redoEdit: (state) => {
      console.log("m redo");
      state.undoIndex++;
      if (state.undoIndex > 0) {
        state.undoIndex = 0;
        return;
      }
      state.playerPainting = state.undoBuffer[state.undoIndex];
    },
    getUndoStateHint: (state, action) => {
      const undoHint = { canUndo: true, canRedo: true };
      if (state.undoIndex + state.undoBuffer.length <= 0)
        undoHint.canUndo = false;
      if (state.undoIndex >= 0) undoHint.canRedo = false;
      return undoHint;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllPaintings
      .addCase(fetchAllPaintings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPaintings.fulfilled, (state, action) => {
        state.loading = false;
        paintingsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAllPaintings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchPaintingById
      .addCase(fetchPaintingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaintingById.fulfilled, (state, action) => {
        state.loading = false;
        paintingsAdapter.upsertOne(state, action.payload);
        state.selectedPaintingId = action.payload.id;
        state.currentPainting = action.payload;
      })
      .addCase(fetchPaintingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchUserPaintings
      .addCase(fetchUserPaintings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPaintings.fulfilled, (state, action) => {
        state.loading = false;
        paintingsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchUserPaintings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle uploadPainting
      .addCase(uploadPainting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadPainting.fulfilled, (state, action) => {
        state.loading = false;
        paintingsAdapter.addOne(state, action.payload);
      })
      .addCase(uploadPainting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deletePainting
      .addCase(deletePainting.fulfilled, (state, action) => {
        paintingsAdapter.removeOne(state, action.payload);
        if (state.selectedPaintingId === action.payload) {
          state.selectedPaintingId = null;
          state.currentPainting = null;
        }
      });
  },
});

// Export selectors
export const {
  selectAll: selectAllPaintings,
  selectById: selectPaintingById,
  selectIds: selectPaintingIds,
} = paintingsAdapter.getSelectors((state) => state.paintings);

// Custom selectors
export const selectUserPaintings = (state, userId) => {
  return selectAllPaintings(state).filter(
    (painting) => painting.userId === userId,
  );
};

export const selectTopPaintings = (state, count = 3) => {
  return selectAllPaintings(state)
    .slice()
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, count);
};

export const selectSelectedPainting = (state) => {
  return selectPaintingById(state, state.paintings.selectedPaintingId);
};

export const {
  selectPainting,
  clearSelectedPainting,
  updatePlayerPainting,
  undoEdit,
  redoEdit,
  getUndoStateHint,
} = paintingsSlice.actions;
export default paintingsSlice.reducer;
