import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import {
  selectPainting,
  selectAllPaintings,
  selectTopPaintings,
} from "../app/slices/paintingsSlice.js";
import { toggleLike } from "../app/slices/likeSlice.js";

export const Museum = connect(
  function mapStateToProps(state) {
    const { userLiked } = state.likes;

    return {
      paintings: selectAllPaintings(state),
      isLoading: state.paintings.loading,
      error: state.paintings.error,
      topPaintings: selectTopPaintings(state),
      currentUser: state.auth.user,
      userLiked,
    };
  },

  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(selectPainting(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings()),
      onToggleLike: (paintingId, userId) =>
        dispatch(toggleLike({ paintingId, userId })),
    };
  },
)(MuseumPage);
