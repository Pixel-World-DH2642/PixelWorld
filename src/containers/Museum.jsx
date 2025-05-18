import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import {
  selectPainting,
  selectAllPaintings,
  selectTopPaintings,
  fetchAllPaintings,
  selectSortedByDatePaintings,
} from "../app/slices/paintingsSlice.js";
import { fetchUserLikes } from "../app/slices/likeSlice.js";
import { toggleLike } from "../app/slices/likeSlice.js";

export const Museum = connect(
  function mapStateToProps(state) {
    return {
      paintings: selectSortedByDatePaintings(state),
      isLoading: state.paintings.loading,
      error: state.paintings.error,
      topPaintings: selectTopPaintings(state),
      currentUser: state.auth.user,
      userLikedPaintings: state.likes.userLikedPaintings,
      likesLoading: state.likes.loading,
    };
  },

  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(selectPainting(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings()),
      onToggleLike: (paintingId, userId) =>
        dispatch(toggleLike({ paintingId, userId })),
      onFetchUserLikes: (userId) => dispatch(fetchUserLikes(userId)),
      onFetchAllPaintings: () => dispatch(fetchAllPaintings()),
    };
  },
)(MuseumPage);
