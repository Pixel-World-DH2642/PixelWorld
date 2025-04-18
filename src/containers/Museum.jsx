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
} from "../features/museumSlice";

export const Museum = connect(

  //works like observer --> monitors the change of components, the values come from the selectors in the slice
  function mapStateToProps(state) {
    return {
      paintings: selectAllPaintings(state),
      currentPaintings: selectCurrentPaintings(state),
      isFirstPage: selectIsFirstPage(state),
      isLastPage: selectIsLastPage(state)
    };
  },

  //wrapping the actions into dispatch
  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(selectPainting(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings())
    };
  },
)(MuseumPage);
