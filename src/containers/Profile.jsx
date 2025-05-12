import { connect } from "react-redux";
import { ProfilePage } from "../pages/ProfilePage";
import { updateDisplayName } from "../app/slices/authSlice"; // Import the action
import { fetchUserPaintings } from "../app/slices/profileSlice";

export const Profile = connect(
  function mapStateToProps(state) {
    return {
      user: state.auth.user,
      authStatus: state.auth.status,
      authError: state.auth.error,
      paintings: state.profile.userPaintings,
      paintingsStatus: state.profile.userPaintingsStatus,
      paintingsError: state.profile.userPaintingsError,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      onChangeDisplayName: (newName) => {
        dispatch(updateDisplayName(newName));
      },
      fetchUserPaintings: (userId) => {
        dispatch(fetchUserPaintings(userId));
      },
    };
  },
)(ProfilePage);
