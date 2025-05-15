import { connect } from "react-redux";
import { WorldPage } from "../pages/WorldPage";
import { fetchDailyQuote } from "../app/slices/quoteSlice";
import { getWeatherData } from "../app/slices/weatherSlice";
import {
  uploadPainting,
  fetchAllPaintings,
} from "../app/slices/paintingsSlice";

export const World = connect(
  function mapStateToProps(state) {
    return {
      user: state.auth.user,
      quote: state.quote.currentQuote,
      weather: state.weather,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onGetQuote: () => dispatch(fetchDailyQuote()),
      onGetWeather: () => dispatch(getWeatherData()),
      onSubmitPainting: (painting) => {
        console.log("Submitting painting:", painting);
        return dispatch(uploadPainting(painting)).then(() => {
          return dispatch(fetchAllPaintings());
        });
      },
    };
  },
)(WorldPage);
