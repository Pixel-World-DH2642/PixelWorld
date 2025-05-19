import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  selectPainting,
  fetchPaintingById,
  fetchAllPaintings,
  updateLikesCount,
} from "../slices/paintingsSlice";
import { setQuoteSaved } from "../slices/quoteSlice";

export const paintingListenerMiddleware = createListenerMiddleware();

paintingListenerMiddleware.startListening({
  actionCreator: selectPainting,
  effect: async (action, listenerApi) => {
    const { payload } = action;
    console.log("Current painting ID set to:", payload);
    if (payload) {
      await listenerApi.dispatch(fetchPaintingById(payload));
    }
  },
});

paintingListenerMiddleware.startListening({
  matcher: (action) => action.type === "paintings/deletePainting/fulfilled",
  effect: async (action, listenerApi) => {
    console.log("Painting deleted successfully, refreshing painting list");

    // Refresh the paintings list
    await listenerApi.dispatch(fetchAllPaintings());

    // After fetching the updated paintings list, check if the current page is empty
    const state = listenerApi.getState();
    const { startIndex, paintingsPerPage, paintings } = state.museum;

    // Check if we're on a page that would now be empty
    if (startIndex > 0 && startIndex >= paintings.length) {
      // Current page is now empty, navigate to the previous page
      const newStartIndex = Math.max(0, startIndex - paintingsPerPage);
      console.log(
        "Current page is now empty, navigating to previous page, index:",
        newStartIndex,
      );
      // listenerApi.dispatch(setStartIndex(newStartIndex));
    }
  },
});

paintingListenerMiddleware.startListening({
  matcher: (action) => action.type === "paintings/deletePainting/rejected",
  effect: async (action, listenerApi) => {
    console.error("Failed to delete painting:", action.error);
  },
});

paintingListenerMiddleware.startListening({
  matcher: (action) => action.type === "likes/fetchLikesCount/fulfilled",
  effect: async (action, listenerApi) => {
    const { paintingId, count } = action.payload;
    console.log(
      "Likes count updated for painting:",
      paintingId,
      "Count:",
      count,
    );
    listenerApi.dispatch(updateLikesCount({ paintingId, count }));
  },
});

// Middleware to listen for changes in the playerPainting object and save it to Firestore
paintingListenerMiddleware.startListening({
  predicate: (action, currentState, previousState) => {
    // Get references to the playerPainting objects
    const currentPainting = currentState.paintings.playerPainting;
    const previousPainting = previousState.paintings.playerPainting;

    // Quick reference check - if they're the same object reference, nothing changed
    if (currentPainting === previousPainting) {
      return false;
    }

    // Deep comparison to detect any changes within the object
    // This handles nested properties as well
    return JSON.stringify(currentPainting) !== JSON.stringify(previousPainting);
  },
  effect: async (action, listenerApi) => {
    // Access the updated playerPainting
    const playerPainting = listenerApi.getState().paintings.playerPainting;
    const userId = listenerApi.getState().auth.user.uid;

    console.log("playerPainting changed:", playerPainting);
    console.log("Action that caused the change:", action);

    if (action.type === "paintings/fetchPlayerPainting/fulfilled") {
      return;
    }

    try {
      if (!userId) {
        console.error("Cannot save painting: No user ID available");
        return;
      }

      // Import required Firebase functions
      const { collection, getDocs, query, where, addDoc, updateDoc, doc } =
        await import("firebase/firestore");
      const { db } = await import("../firebase");

      // Check if this user already has a painting in userPaintings
      const userPaintingRef = collection(db, "userPaintings");
      const q = query(userPaintingRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);

      // Prepare the data to save - ensure structure matches fetchPlayerPainting expectations
      const paintingData = {
        userId: userId,
        // jagged: playerPainting.jagged,
        colorMatrix: playerPainting.colorMatrix,
        savedQuote: playerPainting.savedQuote,
        title: playerPainting.title,
        notes: playerPainting.notes,
        updatedAt: new Date(),
      };

      // If colorMatrix is an array or object, stringify it for Firestore
      if (
        paintingData.colorMatrix &&
        (Array.isArray(paintingData.colorMatrix) ||
          typeof paintingData.colorMatrix === "object")
      ) {
        paintingData.colorMatrix = JSON.stringify(paintingData.colorMatrix);
      }

      if (snapshot.empty) {
        // Create new painting document
        console.log("Creating new painting for user:", userId);
        await addDoc(userPaintingRef, paintingData);
      } else {
        // Update existing painting document
        const paintingDoc = snapshot.docs[0];
        console.log("Updating existing painting for user:", userId);
        await updateDoc(doc(db, "userPaintings", paintingDoc.id), paintingData);
      }

      console.log(
        "Successfully saved player painting to userPaintings collection",
      );
    } catch (error) {
      console.error("Error saving player painting:", error);
    }
  },
});

paintingListenerMiddleware.startListening({
  matcher: (action) =>
    action.type === "paintings/fetchPlayerPainting/fulfilled",
  effect: async (action, listenerApi) => {
    if (
      listenerApi.getState().paintings.playerPainting.savedQuote ===
      listenerApi.getState().quote.currentQuote
    ) {
      console.log("Saved quote matches current quote, updating state");
      listenerApi.dispatch(setQuoteSaved(true));
    }
  },
});

paintingListenerMiddleware.startListening({
  matcher: (action) => action.type === "quote/checkUserQuoteData/fulfilled",
  effect: async (action, listenerApi) => {
    console.log(
      "User quote data checked, current quote:",
      listenerApi.getState().quote.currentQuote,
    );
    console.log(
      "Player painting saved quote:",
      listenerApi.getState().paintings.playerPainting.savedQuote,
    );
    if (
      listenerApi.getState().paintings.playerPainting.savedQuote?.content ===
        listenerApi.getState().quote.currentQuote.content &&
      listenerApi.getState().paintings.playerPainting.savedQuote?.author ===
        listenerApi.getState().quote.currentQuote.author
    ) {
      console.log("Saved quote matches current quote, updating state");
      listenerApi.dispatch(setQuoteSaved(true));
    }
  },
});
