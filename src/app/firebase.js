import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Added
import { setUser } from "./slices/authSlice";
import { fetchPaintings } from './store';
import { setPaintings } from './slices/museumSlice';

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
export const db = getFirestore(app); // Added
export const gProvider = new GoogleAuthProvider();



//get the data here from firestore and put it in the redux store with dispatch in the museum slice
//define an asyc thunck --> get doc, dispatch the museum slice action to put the data in the slice
//define the asyc thunck above in store.js and call here
//store.dispatch (as in the dinner planner)



export function connectToPersistance(store) {
  console.log("Connecting to Firestore...");
  store.dispatch(fetchPaintings()).then((result) => {
    if (result.payload) {
      store.dispatch(setPaintings(result.payload));
    }
  });
}