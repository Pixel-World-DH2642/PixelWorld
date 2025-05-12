import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import {
  selectPainting,
  nextPaintings,
  prevPaintings,
  selectAllPaintings,
  selectCurrentPaintings,
  selectIsFirstPage,
  selectIsLastPage,
  selectAndFetchPainting,
} from "../app/slices/museumSlice.js";

export const Museum = connect(
  // Works like observer --> monitors the change of components, the values come from the selectors in the slice
  function mapStateToProps(state) {
    return {
      paintings: selectAllPaintings(state),
      currentPaintings: selectCurrentPaintings(state),
      isFirstPage: selectIsFirstPage(state),
      isLastPage: selectIsLastPage(state),
    };
  },

  // Wrapping the actions into dispatch
  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(selectAndFetchPainting(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings()),
    };
  },
)(MuseumPage);
