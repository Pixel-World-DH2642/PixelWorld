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
import {
  updateLikesCount,
  updateUserLikeStatus,
  resetLikes,
} from "../slices/likeSlice";

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

// New action creators for likes
export const startLikesListener = (paintingId) => ({
  type: FIREBASE_LISTENER_START,
  payload: { type: "likes", id: paintingId },
});

export const startUserLikeListener = (paintingId, userId) => ({
  type: FIREBASE_LISTENER_START,
  payload: {
    type: "userLike",
    id: `${paintingId}:${userId}`,
    paintingId,
    userId,
  },
});

export const stopLikesListener = (paintingId) => ({
  type: FIREBASE_LISTENER_STOP,
  payload: { type: "likes", id: paintingId },
});

export const stopUserLikeListener = (paintingId, userId) => ({
  type: FIREBASE_LISTENER_STOP,
  payload: { type: "userLike", id: `${paintingId}:${userId}` },
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
    // For likes count listener
    else if (type === "likes" && id) {
      const likesRef = collection(db, "likes");
      const q = query(likesRef, where("paintingId", "==", id));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          // Update total count in real-time
          store.dispatch(updateLikesCount(snapshot.size));
        },
        (error) => {
          console.error("Error in likes listener:", error);
        },
      );

      // Save the unsubscribe function
      activeListeners[`${type}:${id}`] = unsubscribe;
    }
    // For user's like status listener
    else if (type === "userLike" && paintingId && userId) {
      const likesRef = collection(db, "likes");
      const q = query(
        likesRef,
        where("paintingId", "==", paintingId),
        where("userId", "==", userId),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          // Update whether the current user has liked this painting
          store.dispatch(updateUserLikeStatus(!snapshot.empty));
        },
        (error) => {
          console.error("Error in user like listener:", error);
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
      } else if (type === "likes" || type === "userLike") {
        store.dispatch(resetLikes());
      }
    }
  }
  // Watch for painting selection changes to auto-start listeners
  else if (action.type === "detail/setCurrentPaintingId" && action.payload) {
    const paintingId = action.payload;
    const state = store.getState();
    const userId = state.auth?.user?.uid;

    // Stop any existing comments and likes listeners
    Object.keys(activeListeners).forEach((key) => {
      if (
        key.startsWith("comments:") ||
        key.startsWith("likes:") ||
        key.startsWith("userLike:")
      ) {
        activeListeners[key]();
        delete activeListeners[key];
      }
    });

    // Clear current data
    store.dispatch(clearComments());
    store.dispatch(resetLikes());

    // Start new listeners for this painting
    if (paintingId) {
      store.dispatch(startCommentsListener(paintingId));
      store.dispatch(startLikesListener(paintingId));

      // Start user like listener if user is logged in
      if (userId) {
        store.dispatch(startUserLikeListener(paintingId, userId));
      }
    }
  }
  // Handle user login/logout to update user like status
  else if (
    action.type === "auth/loginSuccess" ||
    action.type === "auth/logoutSuccess"
  ) {
    const state = store.getState();
    const paintingId = state.detail.currentPaintingId;
    const userId = state.auth?.user?.uid;

    // Stop any existing user like listeners
    Object.keys(activeListeners).forEach((key) => {
      if (key.startsWith("userLike:")) {
        activeListeners[key]();
        delete activeListeners[key];
      }
    });

    // Start new user like listener if user is logged in and viewing a painting
    if (userId && paintingId) {
      store.dispatch(startUserLikeListener(paintingId, userId));
    }
  }

  return result;
};

export default firebaseListenerMiddleware;
