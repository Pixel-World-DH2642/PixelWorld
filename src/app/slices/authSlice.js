import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, gProvider } from "../firebase";
import {
  signInWithPopup,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// Define the async thunk for Google sign-in
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithPopup(auth, gProvider);
      console.log("User signed in successfully:", userCredential.user);
      // Return the serializable user data
      // Avoid returning the entire userCredential.user object if it contains non-serializable data
      // like functions or complex objects. Extract only necessary serializable fields.
      const { uid, displayName, email, photoURL } = userCredential.user;
      return { uid, displayName, email, photoURL };
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return rejectWithValue(error.message); // Pass serializable error message
    }
  },
);

// Define the async thunk for sign-up with email/password
export const signUpWithEmailPassword = createAsyncThunk(
  "auth/signUpWithEmailPassword",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User created successfully:", userCredential.user);

      // Extract serializable user data
      const { uid, displayName, photoURL } = userCredential.user;
      return { uid, displayName, email, photoURL };
    } catch (error) {
      console.error("Error during sign-up:", error);
      return rejectWithValue(error.message);
    }
  },
);

// Define the async thunk for login with email/password
export const loginWithEmailPassword = createAsyncThunk(
  "auth/loginWithEmailPassword",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("User logged in successfully:", userCredential.user);

      // Extract serializable user data
      const { uid, displayName, photoURL } = userCredential.user;
      return { uid, displayName, email, photoURL };
    } catch (error) {
      console.error("Error during login:", error);
      return rejectWithValue(error.message);
    }
  },
);

// Define the async thunk for sign-out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      return null; // Indicate successful logout
    } catch (error) {
      console.error("Error during sign-out:", error);
      return rejectWithValue(error.message);
    }
  },
);

export const updateDisplayName = createAsyncThunk(
  "auth/updateDisplayName",
  async (newDisplayName, { rejectWithValue, getState }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("No user logged in");
    }
    try {
      await updateProfile(user, { displayName: newDisplayName });
      console.log("Display name updated successfully");
      // Return the updated user info needed for the state
      const { uid, email, photoURL } = user; // Get other details
      return { uid, displayName: newDisplayName, email, photoURL }; // Return updated user object slice
    } catch (error) {
      console.error("Error updating display name:", error);
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  status: "loading", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = action.payload ? "succeeded" : "idle";
      state.error = null;
    },
    authLoaded: (state) => {
      if (state.status === "loading" && !state.user) {
        state.status = "idle";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Google Sign-In lifecycle
      .addCase(signInWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
      })

      // Handle Email/Password Sign-Up lifecycle
      .addCase(signUpWithEmailPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUpWithEmailPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signUpWithEmailPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
      })

      // Handle Email/Password Login lifecycle
      .addCase(loginWithEmailPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithEmailPassword.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginWithEmailPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.user = null;
      })

      // Handle Logout lifecycle
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // Keep user state as is or clear it depending on desired behavior on logout failure
      })
      .addCase(updateDisplayName.pending, (state) => {
        // Optionally set a specific status like 'updating' or use 'loading'
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateDisplayName.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Ensure user object exists before updating
        if (state.user) {
          state.user.displayName = action.payload.displayName;
        } else {
          // This case might happen if the state was somehow cleared
          // Re-initialize user state with the payload
          state.user = action.payload;
        }
      })
      .addCase(updateDisplayName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser, authLoaded } = authSlice.actions;
export default authSlice.reducer;
