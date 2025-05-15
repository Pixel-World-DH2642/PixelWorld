import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import quoteSlice from "./slices/quoteSlice";
import weatherSlice from "./slices/weatherSlice";
import authSlice from "./slices/authSlice";
import commentsSlice from "./slices/commentsSlice";
import likeSlice from "./slices/likeSlice";
import paintingsSlice from "./slices/paintingsSlice";
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
      weather: weatherSlice,
      comments: commentsSlice,
      likes: likeSlice,
      paintings: paintingsSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(firebaseListenerMiddleware)
        .concat(paintingListenerMiddleware.middleware),
    preloadedState: initialState,
  });
}
