import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../app/slices/authSlice";
import { Button } from "@mui/material";

export function NavBar({
  enableBack = true,
  backLocation,
  beforeNavigate,
  showProfile = true,
  title,
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
    <div className="flex flex-col justify-between border-b pb-2 gap-4">
      {enableBack && (
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
          className="flex transition self-start gap-2 transform duration-200 items-center cursor-pointer"
        >
          <img src="/assets/back_arrow.png" className="h-4 sm:h-6"></img>
          <div className=" hover:underline flex text-xl sm:text-3xl">
            Back{backLocation ? " to " + backLocation : ""}
          </div>
        </button>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xl sm:text-3xl font-bold text-center">
          {title ?? ""}
        </div>
        {user ? (
          <div className="flex items-center justify-end gap-2 sm:gap-4">
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
                  className="w-6 h-6 sm:w-8 sm:h-8 aspect-square bg-gray-300 rounded-full border border-black hover:scale-110 transition transform duration-200" // Added border and bg as fallback
                />
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex transition transform duration-200 items-center cursor-pointer"
            >
              <div className="hover:underline flex text-sm sm:text-base">
                Sign out
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <Button
              variant="contained"
              onClick={() => {
                if (beforeNavigate) {
                  beforeNavigate();
                }
                navigate("/login");
              }}
            >
              <div className="hover:underline flex text-sm sm:text-base">
                Sign in
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
