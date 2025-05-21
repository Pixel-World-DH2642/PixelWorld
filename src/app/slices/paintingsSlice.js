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
import { hexToRgb } from "../../utils/color";

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
      // Fetch all paintings
      const paintingsCollection = collection(db, "paintings");
      const snapshot = await getDocs(paintingsCollection);

      // Get all paintings first
      const paintings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...normalizeFirestoreData(doc.data()),
        likesCount: 0, // Initialize with zero likes
      }));

      // Now get all likes
      const likesCollection = collection(db, "likes");
      const likesSnapshot = await getDocs(likesCollection);

      // Create a map to count likes per painting
      const likesCountMap = {};
      likesSnapshot.docs.forEach((doc) => {
        const likeData = doc.data();
        const paintingId = likeData.paintingId;
        likesCountMap[paintingId] = (likesCountMap[paintingId] || 0) + 1;
      });

      // Update paintings with like counts
      return paintings.map((painting) => ({
        ...painting,
        likesCount: likesCountMap[painting.id] || 0,
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

export const fetchPlayerPainting = createAsyncThunk(
  "paintings/fetchPlayerPainting",
  async (userId, thunkAPI) => {
    try {
      if (!userId) {
        return thunkAPI.rejectWithValue("No user ID provided");
      }

      // Fetch the player's painting from userPaintings collection
      const userPaintingRef = collection(db, "userPaintings");
      const q = query(userPaintingRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      const jaggedNull = Array.from({ length: 16 }, () => Array(16).fill(null));

      if (snapshot.empty) {
        // No player painting found, return initial empty state
        return {
          jagged: jaggedNull,
          colorMatrix: null,
          savedQuote: null,
          title: null,
          notes: null,
        };
      }

      // Get the first painting (assuming one user has only one player painting)
      const paintingData = normalizeFirestoreData(snapshot.docs[0].data());
      // Convert colorMatrix string back to object/array if needed
      if (paintingData.colorMatrix) {
        console.log("ColorMatrix:", paintingData.colorMatrix);
        try {
          // Handle colorMatrix parsing more robustly
          if (typeof paintingData.colorMatrix === "string") {
            // Check if it's already an array (from normalizeFirestoreData function)
            if (Array.isArray(paintingData.colorMatrix)) {
              // Already parsed, do nothing
            } else {
              // Clean up the input string
              let colorMatrixString = paintingData.colorMatrix;

              // If it looks like a comma-separated list but not properly formatted
              if (
                colorMatrixString.includes(",") &&
                !colorMatrixString.startsWith("[")
              ) {
                // Try to convert to a proper array by splitting on commas
                const colorArray = colorMatrixString.split(",").map((item) => {
                  const trimmed = item.trim();
                  return trimmed === ""
                    ? null
                    : trimmed.startsWith("#")
                      ? trimmed
                      : null;
                });
                paintingData.colorMatrix = colorArray;
              } else {
                // Try regular JSON parse with error handling
                try {
                  paintingData.colorMatrix = JSON.parse(colorMatrixString);
                } catch (parseError) {
                  console.error(
                    "JSON parse failed, falling back to array conversion:",
                    parseError,
                  );
                  // If JSON parse fails, try to extract values with regex
                  const hexColors =
                    colorMatrixString.match(/#[0-9a-fA-F]{6}/g) || [];
                  const nullCount = 256 - hexColors.length; // Assume 16x16 grid
                  // Create array with nulls and insert hex values
                  paintingData.colorMatrix = Array(nullCount).fill(null);
                  hexColors.forEach((color, i) => {
                    paintingData.colorMatrix.splice(i, 0, color);
                  });
                }
              }
            }
          }

          // Convert the colormatrix to jagged which is a 2d array
          paintingData.jagged = [];
          // jagged = [{rgba:{r:0,g:0,b:0,a:255},hex:"#00000000"}]
          for (let i = 0; i < 16; i++) {
            paintingData.jagged[i] = [];

            for (let j = 0; j < 16; j++) {
              const color = paintingData.colorMatrix[i * 16 + j];
              if (color) {
                paintingData.jagged[i][j] = {
                  rgba: hexToRgb(color),
                  hex: color,
                };
              } else {
                paintingData.jagged[i][j] = null;
              }
            }
          }
        } catch (e) {
          console.error("Failed to process colorMatrix:", e);
          // Create empty jagged array as fallback
          const jaggedNull = Array.from({ length: 16 }, () =>
            Array(16).fill(null),
          );
          paintingData.jagged = jaggedNull;
          paintingData.colorMatrix = Array(256).fill(null);
        }
      }

      // Ensure all expected fields are present
      return {
        jagged: paintingData.jagged || jaggedNull,
        colorMatrix: paintingData.colorMatrix || null,
        savedQuote: paintingData.savedQuote || null,
        title: paintingData.title || null,
        notes: paintingData.notes || null,
      };
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
    playerPainting: {
      jagged: null, // used for editing
      colorMatrix: null, // this is what we gonna save
      savedQuote: null,
      title: null,
      notes: null,
    },
    undoBuffer: [],
    undoIndex: 0,
  }),
  reducers: {
    selectPainting: (state, action) => {
      state.selectedPaintingId = action.payload;
    },
    clearSelectedPainting: (state) => {
      state.selectedPaintingId = null;
    },
    updatePlayerPainting: (state, action) => {
      // If we have undone some changes and now make a new edit,
      // discard the redo history by slicing the buffer to keep only the valid history
      if (state.undoIndex < 0) {
        state.undoBuffer = state.undoBuffer.slice(
          0,
          state.undoBuffer.length + state.undoIndex,
        );
        state.undoIndex = 0; // Reset the undo index
      }

      // Now add the current state to the undo buffer
      state.undoBuffer = state.undoBuffer.slice();
      state.undoBuffer.push(state.playerPainting);
      if (state.undoBuffer.length > 30) state.undoBuffer.splice(0, 1);

      // Update the player painting with the new data
      state.playerPainting.jagged = action.payload;
      // Convert jagged to colorMatrix
      state.playerPainting.colorMatrix = action.payload.flat();
      // and only take the hex
      state.playerPainting.colorMatrix = state.playerPainting.colorMatrix.map(
        (color) => color?.hex || null,
      );
    },
    undoEdit: (state) => {
      state.undoIndex--;
      if (state.undoIndex + state.undoBuffer.length < 0) {
        state.undoIndex++;
        return;
      }

      state.playerPainting =
        state.undoBuffer[state.undoBuffer.length - 1 + state.undoIndex];
    },
    redoEdit: (state) => {
      state.undoIndex++;
      if (state.undoIndex > 0) {
        state.undoIndex = 0;
        return;
      }
      state.playerPainting =
        state.undoBuffer[state.undoBuffer.length - 1 + state.undoIndex];
    },
    updateLikesCount: (state, action) => {
      const { paintingId, count } = action.payload;
      if (state.entities[paintingId]) {
        state.entities[paintingId].likesCount = count;
      }
    },
    saveQuoteToPlayerPainting: (state, action) => {
      const { isChecked, quote } = action.payload;
      console.log("isChecked:", isChecked);
      console.log("Saving quote to player painting:", quote);
      if (isChecked) {
        state.playerPainting.savedQuote = quote;
      } else {
        state.playerPainting.savedQuote = null;
      }
    },
    removeQuoteFromPlayerPainting: (state) => {
      state.playerPainting.savedQuote = null;
    },
    resetPaintingsState: (state) => {
      // Clear user-specific data
      state.selectedPaintingId = null;
      state.playerPainting = {
        jagged: null,
        colorMatrix: null,
        savedQuote: null,
        title: null,
        notes: null,
      };
      state.undoBuffer = [];
      state.undoIndex = 0;
      state.error = null;
      // Clear entities (all paintings)
      paintingsAdapter.removeAll(state);
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

      // Handle fetchPlayerPainting
      .addCase(fetchPlayerPainting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerPainting.fulfilled, (state, action) => {
        state.loading = false;
        state.playerPainting = action.payload;
        state.undoBuffer = [{ ...action.payload }];
        state.undoIndex = 0;
      })
      .addCase(fetchPlayerPainting.rejected, (state, action) => {
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

export const selectSortedByDatePaintings = (state) => {
  return selectAllPaintings(state)
    .slice()
    .sort((a, b) => {
      // Sort by createdAt descending (newest first)
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });
};

export const selectTopPaintings = (state, count = 3) => {
  return selectAllPaintings(state)
    .slice()
    .filter((painting) => (painting.likesCount || 0) > 0)
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, count);
};

export const selectSelectedPainting = (state) => {
  return selectPaintingById(state, state.paintings.selectedPaintingId);
};

export const selectUndoStateHint = (state) => {
  const { undoIndex, undoBuffer } = state.paintings;
  const undoHint = { canUndo: true, canRedo: true };
  if (undoIndex + undoBuffer.length <= 1) undoHint.canUndo = false;
  if (undoIndex >= 0) undoHint.canRedo = false;
  return undoHint;
};

export const {
  selectPainting,
  clearSelectedPainting,
  updatePlayerPainting,
  undoEdit,
  redoEdit,
  updateLikesCountByOne,
  updateLikesCount,
  saveQuoteToPlayerPainting,
  removeQuoteFromPlayerPainting,
  resetPaintingsState,
} = paintingsSlice.actions;
export default paintingsSlice.reducer;
