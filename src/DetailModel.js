export const painting = {
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
};
