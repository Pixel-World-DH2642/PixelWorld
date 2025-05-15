import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import { fetchDailyQuote } from "../app/slices/quoteSlice";
import { getWeatherData } from "../app/slices/weatherSlice";
import { pixelEditorSlice } from "../app/slices/pixelEditorSlice";

export const World = connect(
  function mapStateToProps(state) {
    return {
      quote: state.quote.currentQuote,
      weather: state.weather,
      //from old pixel editor container
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onGetQuote: () => dispatch(fetchDailyQuote()),
      onGetWeather: () => dispatch(getWeatherData()),
      //from old pixel editor container
    };
  },
)(WorldPage);
