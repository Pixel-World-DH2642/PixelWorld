import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";

export const World = connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return {};
  },
)(WorldPage);
