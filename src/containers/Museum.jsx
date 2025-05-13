import { connect } from "react-redux";
import { MuseumPage } from "../pages/MuseumPage";
import {
  nextPaintings,
  prevPaintings,
  selectAndFetchPainting,
} from "../app/slices/museumSlice.js";

export const Museum = connect(
  // Works like observer --> monitors the change of components, the values come from the selectors in the slice
  function mapStateToProps(state) {
    const { paintings, startIndex, paintingsPerPage } = state.museum;
    return {
      paintings: paintings,
      currentPaintings: paintings.slice(startIndex, startIndex + paintingsPerPage),
      isFirstPage: startIndex === 0,
      isLastPage: startIndex + paintingsPerPage >= paintings.length,

      //fro loading and the details page (?)
      isLoading: state.museum.isLoading,
      error: state.museum.error,
      selectedPaintingId: state.museum.selectedPaintingId
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
