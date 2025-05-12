import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import paintingSlice from "./slices/paintingSlice";
import weatherSlice from "./slices/weatherSlice";
import museumSlice from "./slices/museumSlice";
import authSlice from "./slices/authSlice";
import profileSlice from "./slices/profileSlice";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const fetchPaintings = createAsyncThunk(
  "app/fetchPaintings",
  async (_, thunkAPI) => {
    try {
      const paintingsCollection = collection(db, "paintings");
      const paintingsSnapshot = await getDocs(paintingsCollection);
      const paintings = paintingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return paintings;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const appSlice = createSlice({
  name: "app",
  initialState: {
    ready: false,
  },
  reducers: {
    setReady: (state) => {
      state.ready = true;
    },
  },
});

export default function configureReduxStore() {
  console.log("Configuring Redux store...");
  const initialState = {};
  return configureStore({
    reducer: {
      app: appSlice.reducer,
      auth: authSlice,
      quote: quoteSlice,
      painting: paintingSlice,
      weather: weatherSlice,
      museum: museumSlice,
      profile: profileSlice,
    },
    preloadedState: initialState,
  });
}
