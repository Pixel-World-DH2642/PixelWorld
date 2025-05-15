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
    return {
      painting:
        state.paintings.currentPainting || selectSelectedPainting(state),
      isLoading: state.paintings.loading,
      error: state.paintings.error,
      comments: getSortedComments(state),
      commentsLoading: state.comments.status === "loading",
      commentsError: state.comments.error,
      currentUser: state.auth?.user,
      likesCount: state.likes.count,
      userLiked: state.likes.userLiked,
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
