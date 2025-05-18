import { connect } from "react-redux";
import { DetailPage } from "../pages/DetailPage";
import { toggleLike, resetLikes } from "../app/slices/likeSlice";
import {
  addComment,
  deleteComment,
  clearComments,
  getSortedComments,
} from "../app/slices/commentsSlice";
import { deletePainting } from "../app/slices/paintingsSlice";
import { selectSelectedPainting } from "../app/slices/paintingsSlice";

export const Detail = connect(
  function mapStateToProps(state) {
    const currentPainting = selectSelectedPainting(state);
    const paintingId = currentPainting?.id;

    return {
      painting: currentPainting,
      isLoading: state.paintings.loading,
      error: state.paintings.error,
      comments: getSortedComments(state),
      commentsLoading: state.comments.status === "loading",
      commentsError: state.comments.error,
      currentUser: state.auth?.user,
      likesCount: currentPainting?.likesCount || 0,
      userLiked: paintingId
        ? state.likes.userLikedPaintings.includes(paintingId)
        : false,
      likesLoading: state.likes.loading,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onToggleLike: (paintingId, userId) => {
        if (userId && paintingId) {
          dispatch(toggleLike({ paintingId, userId }));
        }
      },
      onClearLikes: () => dispatch(resetLikes()),
      onAddComment: (paintingId, userId, userName, text) =>
        dispatch(addComment({ paintingId, userId, userName, text })),
      onDeleteComment: (commentId, paintingId) =>
        dispatch(deleteComment({ commentId, paintingId })),
      onClearComments: () => dispatch(clearComments()),
      onDeletePainting: (paintingId, userId) => {
        if (userId && paintingId) {
          return dispatch(deletePainting({ paintingId, userId }));
        }
      },
    };
  },
)(DetailPage);
