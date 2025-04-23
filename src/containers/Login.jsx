import { connect } from "react-redux";
import { LoginPage } from "../pages/LoginPage";
import { signInWithGoogle } from "../app/slices/authSlice";

export const Login = connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return {
      onLoginWithGoogle: async (navigate) => {
        try {
          await dispatch(signInWithGoogle()).unwrap();
          navigate("/");
        } catch (error) {
          console.error("Error during Google login:", error);
        }
      },
    };
  },
)(LoginPage);
