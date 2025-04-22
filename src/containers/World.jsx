import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import { fetchDailyQuote } from "../app/slices/quoteSlice";

export const World = connect(
  function mapStateToProps(state) {
    return {
      quote: state.quote.currentQuote,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onGetQuote: () => dispatch(fetchDailyQuote()),
    };
  },
)(WorldPage);
