import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import {
  selectPainting,
  selectAllPaintings,
} from "../app/slices/paintingsSlice";

export const Museum = connect(
  function mapStateToProps(state) {
    return {
      paintings: selectAllPaintings(state),
      isLoading: state.paintings.loading,
      error: state.paintings.error,
    };
  },

  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(selectPainting(id)),
    };
  },
)(MuseumPage);
