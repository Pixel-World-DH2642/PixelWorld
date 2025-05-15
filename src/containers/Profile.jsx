import { connect } from "react-redux";
import { ProfilePage } from "../pages/ProfilePage";
import { updateDisplayName } from "../app/slices/authSlice";
import {
  fetchUserPaintings,
  selectPainting,
  selectUserPaintings,
} from "../app/slices/paintingsSlice";

export const Profile = connect(
  function mapStateToProps(state) {
    return {
      user: state.auth.user,
      authStatus: state.auth.status,
      authError: state.auth.error,
      // Get user paintings from the normalized store
      paintings: state.auth.user
        ? selectUserPaintings(state, state.auth.user.uid)
        : [],
      paintingsLoading: state.paintings.loading,
      paintingsError: state.paintings.error,
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
      onSelectPainting: (id) => {
        dispatch(selectPainting(id));
      },
    };
  },
)(ProfilePage);
