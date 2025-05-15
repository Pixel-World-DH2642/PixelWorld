import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  addLiveComment,
  updateLiveComment,
  removeLiveComment,
  clearComments,
} from "../slices/commentsSlice";

// Keep track of active listeners
let activeListeners = {};

// Action types to identify our middleware actions
export const FIREBASE_LISTENER_START = "firebase/listenerStart";
export const FIREBASE_LISTENER_STOP = "firebase/listenerStop";

// Action creators
export const startCommentsListener = (paintingId) => ({
  type: FIREBASE_LISTENER_START,
  payload: { type: "comments", id: paintingId },
});

export const stopCommentsListener = (paintingId) => ({
  type: FIREBASE_LISTENER_STOP,
  payload: { type: "comments", id: paintingId },
});

// The middleware
const firebaseListenerMiddleware = (store) => (next) => (action) => {
  console.log("Firebase Listener Middleware Action:", action);
  // First pass the action to the next middleware or reducer
  const result = next(action);

  // Then check if it's one of our middleware actions
  if (action.type === FIREBASE_LISTENER_START) {
    const { type, id } = action.payload;

    // If we already have an active listener for this type and ID, unsubscribe first
    if (activeListeners[`${type}:${id}`]) {
      activeListeners[`${type}:${id}`]();
      delete activeListeners[`${type}:${id}`];
    }

    // Set up a new listener based on the type
    if (type === "comments" && id) {
      const commentsRef = collection(db, "comments");
      const q = query(
        commentsRef,
        where("paintingId", "==", id),
        orderBy("timestamp", "desc"),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const commentData = { id: change.doc.id, ...change.doc.data() };

            if (change.type === "added") {
              store.dispatch(addLiveComment(commentData));
            } else if (change.type === "modified") {
              store.dispatch(updateLiveComment(commentData));
            } else if (change.type === "removed") {
              store.dispatch(removeLiveComment(change.doc.id));
            }
          });
        },
        (error) => {
          console.error("Error in comments listener:", error);
        },
      );

      // Save the unsubscribe function
      activeListeners[`${type}:${id}`] = unsubscribe;
    }
  } else if (action.type === FIREBASE_LISTENER_STOP) {
    const { type, id } = action.payload;

    // Unsubscribe if we have an active listener
    if (activeListeners[`${type}:${id}`]) {
      activeListeners[`${type}:${id}`]();
      delete activeListeners[`${type}:${id}`];

      // Clear comments when stopping the listener
      if (type === "comments") {
        store.dispatch(clearComments());
      }
    }
  }
  // Watch for painting selection changes to auto-start listeners
  else if (action.type === "detail/setCurrentPaintingId" && action.payload) {
    const paintingId = action.payload;

    // Stop any existing comments listeners
    Object.keys(activeListeners).forEach((key) => {
      if (key.startsWith("comments:")) {
        activeListeners[key]();
        delete activeListeners[key];
      }
    });

    // Clear comments
    store.dispatch(clearComments());

    // Start a new listener for this painting
    if (paintingId) {
      console.log("Starting comments listener for painting ID:", paintingId);
      store.dispatch(startCommentsListener(paintingId));
    }
  }

  return result;
};

export default firebaseListenerMiddleware;
