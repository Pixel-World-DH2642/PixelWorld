import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// the dummy data for paintings
const initialState = {
  paintings: [
    {
        id: "painting1",
        title: "Beauty",
        colorMatrix: Array(32)
          .fill()
          .map(() =>
            Array(32)
              .fill()
              .map(
                () =>
                  "#" +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0"),
              ),
          ),
        savedQuote: "Art washes away from the soul the dust of everyday life.",
        author: "PicassoFan123",
        date: Date.now() - 100000000,
        authorNotes: "Inspired by the colors of a Spanish sunset.",
        likedBy: ["user1", "user2", "user3"],
      },
      {
        id: "painting2",
        title: "Silence in Spring",
        colorMatrix: Array(32)
          .fill()
          .map(() =>
            Array(32)
              .fill()
              .map(
                () =>
                  "#" +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0"),
              ),
          ),
        savedQuote: "Every artist was first an amateur.",
        author: "art_lover_98",
        date: Date.now() - 50000000,
        authorNotes: "My first attempt using only shades of blue.",
        likedBy: ["user5"],
      },
      {
        id: "painting3",
        title: "Wind",
        colorMatrix: Array(32)
          .fill()
          .map(() =>
            Array(32)
              .fill()
              .map(
                () =>
                  "#" +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0"),
              ),
          ),
        savedQuote: "Creativity takes courage.",
        author: "beginner_painter",
        date: Date.now() - 2000000,
        authorNotes: "Experimented with pixel symmetry.",
        likedBy: [],
      },
      {
        id: "painting4",
        title: "Horse",
        colorMatrix: Array(32)
          .fill()
          .map(() =>
            Array(32)
              .fill()
              .map(
                () =>
                  "#" +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0"),
              ),
          ),
        savedQuote:
          "Two things are infinite: the universe and human stupidity; and Im not sure about the universe.",
        author: "Painter345",
        date: Date.now() - 100000000,
        authorNotes: "I painted this on a vacation",
        likedBy: ["user1", "user3"],
      },
      {
        id: "painting5",
        title: "Love in  the sky",
        colorMatrix: Array(32)
          .fill()
          .map(() =>
            Array(32)
              .fill()
              .map(
                () =>
                  "#" +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, "0"),
              ),
          ),
        savedQuote: "I love to fly",
        author: "art_enthuisast_98",
        date: Date.now() - 50000000,
        authorNotes: "I like to paint with this app",
        likedBy: ["user5", "PicassoFan123"],
      },
  ],
  selectedPaintingId: null,
  startIndex: 0,
  paintingsPerPage: 3
};

export const museumSlice = createSlice({
  name: 'museum',
  initialState,
  reducers: {
    selectPainting: (state, action) => {
      state.selectedPaintingId = action.payload;
    },
    nextPaintings: (state) => {
      if (state.startIndex + state.paintingsPerPage < state.paintings.length) {
        state.startIndex += state.paintingsPerPage;
      }
    },
    prevPaintings: (state) => {
      if (state.startIndex > 0) {
        state.startIndex -= state.paintingsPerPage;
      }
    }
  },
});

// Export actions
export const { selectPainting, nextPaintings, prevPaintings } = museumSlice.actions;

// Selectors
export const selectAllPaintings = (state) => state.museum.paintings;
//show the paintings which fit on the screen (max 3 - paintingsPerPage)
export const selectCurrentPaintings = (state) => {
  const { paintings, startIndex, paintingsPerPage } = state.museum;
  return paintings.slice(startIndex, startIndex + paintingsPerPage);
};
export const selectIsFirstPage = (state) => state.museum.startIndex === 0;
export const selectIsLastPage = (state) => {
  const { startIndex, paintingsPerPage, paintings } = state.museum;
  return startIndex + paintingsPerPage >= paintings.length;
};

export default museumSlice.reducer;