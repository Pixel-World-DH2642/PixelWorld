import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";

export const Museum = connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return {};
  },
)(MuseumPage);
