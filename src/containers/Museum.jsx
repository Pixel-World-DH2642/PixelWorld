import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";

import { 
  selectPainting, 
  nextPaintings, 
  prevPaintings,
  selectAllPaintings,
  selectCurrentPaintings,
  selectIsFirstPage,
  selectIsLastPage
} from "../pages/MuseumPage";

export const Museum = connect(
  function mapStateToProps(state) {
    return {
      paintings: selectAllPaintings(state),
      currentPaintings: selectCurrentPaintings(state),
      isFirstPage: selectIsFirstPage(state),
      isLastPage: selectIsLastPage(state)
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(selectPainting(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings())
    };
  },
)(MuseumPage);
