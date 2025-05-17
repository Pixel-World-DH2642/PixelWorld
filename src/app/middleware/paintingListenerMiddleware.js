import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  selectPainting,
  fetchPaintingById,
  fetchAllPaintings,
} from "../slices/paintingsSlice";
import { fetchUserLikes } from "../slices/likeSlice";

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
  matcher: (action) => action.type === "likes/toggleLike/fulfilled",
  effect: async (action, listenerApi) => {
    const { payload } = action;
    console.log("Like status updated successfully:", payload);
    await listenerApi.dispatch(fetchAllPaintings());
    await listenerApi.dispatch(fetchUserLikes(payload.userId));
  },
});
