import { connect } from "react-redux";
import { ProfilePage } from "../pages/ProfilePage";
import { updateDisplayName } from "../app/slices/authSlice"; // Import the action

export const Profile = connect(
  function mapStateToProps(state) {
    return {
      user: state.auth.user,
      // Pass auth status and error for better UI feedback
      authStatus: state.auth.status,
      authError: state.auth.error,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onChangeDisplayName: (newName) => {
        dispatch(updateDisplayName(newName));
      },
    };
  },
)(ProfilePage);
