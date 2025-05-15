import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import detailSlice from "./slices/detailSlice";
import weatherSlice from "./slices/weatherSlice";
import museumSlice from "./slices/museumSlice";
import authSlice from "./slices/authSlice";
import profileSlice from "./slices/profileSlice";
import commentsSlice from "./slices/commentsSlice";
import likeSlice from "./slices/likeSlice";
import firebaseListenerMiddleware from "./middleware/firebaseListenerMiddleware";
import { paintingListenerMiddleware } from "./middleware/paintingListenerMiddleware";

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
      detail: detailSlice,
      weather: weatherSlice,
      museum: museumSlice,
      profile: profileSlice,
      comments: commentsSlice,
      likes: likeSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(firebaseListenerMiddleware)
        .concat(paintingListenerMiddleware.middleware),
    preloadedState: initialState,
  });
}
