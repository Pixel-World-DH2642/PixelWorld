//Here the Redux state/actions is bind to the Detail Page
import { connect } from "react-redux";
import { DetailPage } from "../pages/DetailPage";
import { likePainting, dislikePainting } from "../app/slices/paintingSlice";
import { painting as mockPainting } from "../DetailModel";

export const Detail = connect(
  function mapStateToProps(state) {
    return {
      painting: state.painting.currentPainting || mockPainting,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onLikePainting: (userId) => dispatch(likePainting(userId)),
      onDislikePainting: (userId) => dispatch(dislikePainting(user)),
    };
  },
)(DetailPage);
