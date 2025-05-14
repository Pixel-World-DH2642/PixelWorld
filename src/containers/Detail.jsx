import { connect } from "react-redux";
import { DetailPage } from "../pages/DetailPage";
import { likePainting, dislikePainting } from "../app/slices/detailSlice";
import {
  fetchComments,
  addComment,
  deleteComment,
  clearComments,
} from "../app/slices/commentsSlice";

export const Detail = connect(
  function mapStateToProps(state) {
    return {
      painting: state.detail.currentPainting,
      isLoading: state.detail.isLoading,
      error: state.detail.error,
      comments: state.comments.items,
      commentsLoading: state.comments.status === "loading",
      commentsError: state.comments.error,
      currentUser: state.auth?.user,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onLikePainting: (userId) => dispatch(likePainting(userId)),
      onDislikePainting: (userId) => dispatch(dislikePainting(userId)),
      onFetchComments: (paintingId) => dispatch(fetchComments(paintingId)),
      onAddComment: (paintingId, userId, userName, text) =>
        dispatch(addComment({ paintingId, userId, userName, text })),
      onDeleteComment: (commentId, paintingId) =>
        dispatch(deleteComment({ commentId, paintingId })),
      onClearComments: () => dispatch(clearComments()),
    };
  },
)(DetailPage);
