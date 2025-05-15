import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../app/slices/authSlice";

export function NavBar({
  backLocation,
  onBack,
  beforeNavigate,
  showProfile = true,
}) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logoutUser())
      .then(() => {
        console.log("Logout successful");
        if (beforeNavigate) {
          beforeNavigate();
        }
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="flex items-end justify-between border-b pb-2">
      <button
        onClick={() => {
          if (beforeNavigate) {
            beforeNavigate();
          }
          if (backLocation) {
            navigate("/" + backLocation);
          } else {
            navigate(-1);
          }
        }}
        className="flex transition transform duration-200 items-center cursor-pointer"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-xl sm:text-3xl">
          Back{backLocation ? " to " + backLocation : ""}
        </div>
      </button>
      {user && (
        <div className="flex items-center justify-end gap-4">
          {showProfile && (
            <button
              onClick={() => {
                if (beforeNavigate) {
                  beforeNavigate();
                }
                navigate("/profile");
              }}
              className="flex transition transform duration-200 items-center cursor-pointer"
            >
              <img
                src={user.photoURL || "/assets/default_avatar.png"} // Provide a path to a default avatar
                alt="Profile"
                className="w-8 h-8 bg-gray-300 rounded-full border border-black" // Added border and bg as fallback
              />
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="flex transition transform duration-200 items-center cursor-pointer"
          >
            <div className="hover:underline flex text-sm">Sign out</div>
          </button>
        </div>
      )}
    </div>
  );
}
