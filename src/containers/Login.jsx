import { connect } from "react-redux";
import { LoginPage } from "../pages/LoginPage";
import {
  signInWithGoogle,
  signUpWithEmailPassword,
  loginWithEmailPassword,
} from "../app/slices/authSlice";

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
      onLogin: async (email, password, navigate) => {
        try {
          await dispatch(loginWithEmailPassword({ email, password })).unwrap();
          navigate("/");
        } catch (error) {
          console.error("Error during login:", error);
        }
      },
      onSignup: async (email, password, navigate) => {
        try {
          await dispatch(signUpWithEmailPassword({ email, password })).unwrap();
          navigate("/");
        } catch (error) {
          console.error("Error during signup:", error);
        }
      },
    };
  },
)(LoginPage);
