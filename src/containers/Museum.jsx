import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import { nextPaintings, prevPaintings } from "../app/slices/museumSlice.js";
import { setCurrentPaintingId } from "../app/slices/detailSlice.js";
import { toggleLike } from "../app/slices/likeSlice.js";

export const Museum = connect(
  function mapStateToProps(state) {
    const { paintings, startIndex, paintingsPerPage, isLoading, error } = state.museum;
    const { userLiked } = state.likes;
    const { user: currentUser } = state.auth; // Get currentUser from auth slice
    
    return {
      paintings,
      startIndex,
      paintingsPerPage,
      isLoading,
      error,
      isFirstPage: startIndex === 0,
      isLastPage: startIndex + paintingsPerPage >= paintings.length,
      topPaintings: paintings.slice(0, 3), // First 3 paintings are already sorted by likes
      //for like button
      currentUser,
      userLiked
    };
  },

  // Wrapping the actions into dispatch
  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(setCurrentPaintingId(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings()),
      onToggleLike: (paintingId, userId) => dispatch(toggleLike({ paintingId, userId }))
    };
  },
)(MuseumPage);
