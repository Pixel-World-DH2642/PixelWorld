//Here the Redux state/actions is bind to the Detail Page
import { connect } from "react-redux";
import { DetailPage } from "../pages/DetailPage";
import { likePainting, dislikePainting } from "../app/slices/detailSlice";

export const Detail = connect(
  function mapStateToProps(state) {
    return {
      painting: state.detail.currentPainting,
      isLoading: state.detail.isLoading,
      error: state.detail.error,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onLikePainting: (userId) => dispatch(likePainting(userId)),
      onDislikePainting: (userId) => dispatch(dislikePainting(user)),
    };
  },
)(DetailPage);
