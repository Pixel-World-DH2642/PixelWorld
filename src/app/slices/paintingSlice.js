import { createSlice } from "@reduxjs/toolkit";
import { action } from "mobx";

const initialState = {
  currentPainting: null,
};

const paintingSlice = createSlice({
  name: "painting",
  initialState,
  reducers: {
    setPainting: (state, action) => {
      state.currentPainting = action.payload;
    },
    likePainting: (state, action) => {
      if (!state.currentPainting.likedBy.includes(action.payload)) {
        state.currentPainting.likedBy.push(action.payload);
      }
    },
    dislikePainting: (state, action) => {
      state.currentPainting.likedBy = state.currentPainting.likedBy.filter(
        (user) => user !== action.payload,
      );
    },
  },
});

export const { setPainting, likePainting, dislikePainting } =
  paintingSlice.actions;
export default paintingSlice.reducer;
