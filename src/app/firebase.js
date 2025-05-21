import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Added
import { setUser, authLoaded } from "./slices/authSlice";
import {
  fetchAllPaintings,
  fetchPlayerPainting,
  resetPaintingsState,
} from "./slices/paintingsSlice";
import { fetchUserLikes, resetLikes } from "./slices/likeSlice";
import { fetchUserColorPalette, resetEditor } from "./slices/pixelEditorSlice";
import { resetQuote } from "./slices/quoteSlice";

const firebaseConfig = {
  apiKey: "AIzaSyAA_zepBE6w3GCBV1Kr6_Ui43KcEPk-Mlw",
  authDomain: "pixelworld-45efc.firebaseapp.com",
  projectId: "pixelworld-45efc",
  storageBucket: "pixelworld-45efc.firebasestorage.app",
  messagingSenderId: "403838004561",
  appId: "1:403838004561:web:2944be12f8ca24c4d23770",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const gProvider = new GoogleAuthProvider();

export function connectToPersistance(store) {
  console.log("Connecting to Firestore...");

  // Set up an auth state listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user);
      // User is signed in, extract only the serializable data
      const { uid, displayName, email, photoURL } = user;
      store.dispatch(setUser({ uid, displayName, email, photoURL }));
      store.dispatch(fetchUserLikes(uid));
      store.dispatch(fetchPlayerPainting(uid));
      store.dispatch(fetchUserColorPalette(uid));
    } else {
      // User is signed out
      store.dispatch(setUser(null));
      store.dispatch(resetLikes());
      store.dispatch(resetQuote());
      store.dispatch(resetEditor());
      store.dispatch(resetPaintingsState());
    }

    store.dispatch(authLoaded());
  });

  store.dispatch(fetchAllPaintings());
}
