import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setCurrentPaintingId, fetchPaintingById } from "../slices/detailSlice";

export const detailListenerMiddleware = createListenerMiddleware();
detailListenerMiddleware.startListening({
  actionCreator: setCurrentPaintingId,
  effect: async (action, listenerApi) => {
    const { payload } = action;
    console.log("Current painting ID set to:", payload);
    if (payload) {
      await listenerApi.dispatch(fetchPaintingById(payload));
    }
  },
});
