import { connect } from "react-redux";
import { WelcomePage } from "../pages/WelcomePage";
import { logoutUser } from "../app/slices/authSlice";

export const Welcome = connect(
  function mapStateToProps(state) {
    return {
      user: state.auth.user,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onLogout: async (navigate) => {
        try {
          await dispatch(logoutUser()).unwrap();
          navigate("/");
        } catch (error) {
          console.error("Error during logout:", error);
        }
      },
    };
  },
)(WelcomePage);
