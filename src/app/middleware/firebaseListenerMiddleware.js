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
import { resetLikes, fetchLikesCount } from "../slices/likeSlice";

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

// Modified action creators for likes
export const startLikesCountListener = (paintingId) => ({
  type: FIREBASE_LISTENER_START,
  payload: { type: "likesCount", id: paintingId, paintingId },
});

export const startUserLikesListener = (userId) => ({
  type: FIREBASE_LISTENER_START,
  payload: { type: "userLikes", id: userId, userId },
});

export const stopLikesCountListener = (paintingId) => ({
  type: FIREBASE_LISTENER_STOP,
  payload: { type: "likesCount", id: paintingId },
});

export const stopUserLikesListener = (userId) => ({
  type: FIREBASE_LISTENER_STOP,
  payload: { type: "userLikes", id: userId },
});

// The middleware
const firebaseListenerMiddleware = (store) => (next) => (action) => {
  // First pass the action to the next middleware or reducer
  const result = next(action);

  // Then check if it's one of our middleware actions
  if (action.type === FIREBASE_LISTENER_START) {
    const { type, id, paintingId, userId } = action.payload;

    // If we already have an active listener for this type and ID, unsubscribe first
    if (activeListeners[`${type}:${id}`]) {
      activeListeners[`${type}:${id}`]();
      delete activeListeners[`${type}:${id}`];
    }

    // Set up listeners based on the type
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
    // For real-time likes count monitoring
    else if (type === "likesCount" && paintingId) {
      const likesRef = collection(db, "likes");
      console.log(
        "Listening for likes count changes for painting:",
        paintingId,
      );
      const q = query(likesRef, where("paintingId", "==", paintingId));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          store.dispatch(fetchLikesCount(paintingId));
        },
        (error) => {
          console.error("Error in likes count listener:", error);
        },
      );

      // Save the unsubscribe function
      activeListeners[`${type}:${id}`] = unsubscribe;
    }
    // For user's liked paintings
    else if (type === "userLikes" && userId) {
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("userId", "==", userId));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          // Convert snapshot to array of painting IDs the user has liked
          const likedPaintingIds = snapshot.docs.map(
            (doc) => doc.data().paintingId,
          );

          // Update redux store with the list of paintings this user has liked
          // This could be handled in the likeSlice with a new action
          store.dispatch({
            type: "likes/setUserLikedPaintings",
            payload: likedPaintingIds,
          });
        },
        (error) => {
          console.error("Error in user likes listener:", error);
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

      // Clear relevant state when stopping listeners
      if (type === "comments") {
        store.dispatch(clearComments());
      } else if (type === "userLikes") {
        store.dispatch(resetLikes());
      }
    }
  }
  // Watch for painting selection changes to auto-start listeners
  else if (action.type === "paintings/selectPainting" && action.payload) {
    const paintingId = action.payload;
    const state = store.getState();
    const userId = state.auth?.user?.uid;

    // Stop any existing comments and likes listeners
    Object.keys(activeListeners).forEach((key) => {
      if (key.startsWith("comments:") || key.startsWith("likesCount:")) {
        activeListeners[key]();
        delete activeListeners[key];
      }
    });

    // Clear current data
    store.dispatch(clearComments());

    // Start new listeners for this painting
    if (paintingId) {
      store.dispatch(startCommentsListener(paintingId));
      store.dispatch(startLikesCountListener(paintingId));
    }
  }
  // Handle user login/logout to update user likes status
  else if (action.type === "auth/loginSuccess") {
    const state = store.getState();
    const userId = state.auth?.user?.uid;

    // Start user likes listener when user logs in
    if (userId) {
      store.dispatch(startUserLikesListener(userId));
    }
  } else if (action.type === "auth/logoutUser/fulfilled") {
    // Stop any user likes listeners
    Object.keys(activeListeners).forEach((key) => {
      if (key.startsWith("userLikes:")) {
        activeListeners[key]();
        delete activeListeners[key];
      }
    });
  }

  return result;
};

export default firebaseListenerMiddleware;
