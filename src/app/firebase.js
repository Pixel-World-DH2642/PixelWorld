import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setUser } from "./slices/authSlice";

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

export function connectToPersistance(store) {}
