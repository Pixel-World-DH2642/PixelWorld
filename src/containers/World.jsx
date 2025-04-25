import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import { fetchDailyQuote } from "../app/slices/quoteSlice";
import { getWeatherData } from "../app/slices/weatherSlice";

export const World = connect(
  function mapStateToProps(state) {
    return {
      quote: state.quote.currentQuote,
      weather: state.weather.weatherData,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onGetQuote: () => dispatch(fetchDailyQuote()),
      onGetWeather: () => dispatch(getWeatherData()),
    };
  },
)(WorldPage);
