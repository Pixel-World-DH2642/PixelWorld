import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import { nextPaintings, prevPaintings } from "../app/slices/museumSlice.js";
import { setCurrentPaintingId } from "../app/slices/detailSlice.js";

export const Museum = connect(
  // Works like observer --> monitors the change of components, the values come from the selectors in the slice
  function mapStateToProps(state) {
    const { paintings, startIndex, paintingsPerPage, isLoading, error } =
      state.museum;
    return {
      paintings,

      startIndex,
      paintingsPerPage,

      isLoading,
      error,

      isFirstPage: startIndex === 0,
      isLastPage: startIndex + paintingsPerPage >= paintings.length,
    };
  },

  // Wrapping the actions into dispatch
  function mapDispatchToProps(dispatch) {
    return {
      onSelectPainting: (id) => dispatch(setCurrentPaintingId(id)),
      onNextClick: () => dispatch(nextPaintings()),
      onPrevClick: () => dispatch(prevPaintings()),
    };
  },
)(MuseumPage);
