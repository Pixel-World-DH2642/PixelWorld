import { connect } from "react-redux";
import { DetailPage } from "../pages/DetailPage";
import { toggleLike, resetLikes } from "../app/slices/likeSlice";
import {
  addComment,
  deleteComment,
  clearComments,
  getSortedComments,
} from "../app/slices/commentsSlice";

export const Detail = connect(
  function mapStateToProps(state) {
    return {
      painting: state.detail.currentPainting,
      isLoading: state.detail.isLoading,
      error: state.detail.error,
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
    };
  },
)(DetailPage);
