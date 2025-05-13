import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect, use } from "react";
import { PaintingDisplay } from "../components/PaintingDisplay";

export function ProfilePage({
  user,
  authStatus,
  authError,
  paintings,
  paintingsStatus,
  paintingsError,
  onChangeDisplayName,
  fetchUserPaintings,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

  useEffect(() => {
    if (user) {
      fetchUserPaintings(user.uid); // Fetch paintings when user is available
    }
  }, [user, fetchUserPaintings]);

  // Update local state if user prop changes (e.g., after successful update)
  useEffect(() => {
    if (user?.displayName) {
      setNewDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  const handleEditClick = () => {
    setNewDisplayName(user?.displayName || ""); // Reset input field to current name
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (newDisplayName.trim() && newDisplayName !== user?.displayName) {
      onChangeDisplayName(newDisplayName.trim());
      // Optionally keep editing state until success/failure,
      // or optimistically close it
      setIsEditing(false); // Let's wait for the update to reflect via props
    } else {
      // If name is empty or unchanged, just cancel editing
      setIsEditing(false);
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="flex justify-center items-center font-pixel">
        <div className="text-2xl">Loading profile...</div>
      </div>
    );
  }

  if (authStatus !== "loading" && !user) {
    console.log("Auth status: ", authStatus);
    return <Navigate to="/login" replace />;
  } else {
    return (
      <div className="font-pixel">
        {/* Back Arrow */}
        <Link
          to="/world"
          className="flex transition transform duration-200 pb-4 sm:pb-8 items-center"
        >
          <img
            src="/assets/back_arrow.png"
            className="h-8"
            alt="Back arrow"
          ></img>
          <div className="pl-4 hover:underline flex text-xl sm:text-3xl">
            Back to world
          </div>
        </Link>
        {/* Profile Info */}
        <div className="flex items-center pb-4">
          {/* Profile Picture */}
          <img
            src={user.photoURL || "/assets/default_avatar.png"} // Provide a path to a default avatar
            alt="Profile"
            className="w-12 h-12 bg-gray-300 rounded-full mr-4 border border-black" // Added border and bg as fallback
          />
          <div className="flex items-baseline space-x-2">
            {!isEditing ? (
              <>
                <h1 className="text-xl sm:text-3xl font-bold">
                  {user.displayName || user.email || "User"}
                </h1>
                <button
                  onClick={handleEditClick}
                  className="text-sm flex items-center hover:underline cursor-pointer"
                  disabled={authStatus === "loading"} // Disable while loading/updating
                >
                  Edit <span className="ml-1">&#9998;</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="text-xl font-bold border border-black px-2 py-1"
                  maxLength={30} // Add a reasonable max length
                />
                <button
                  onClick={handleSaveClick}
                  className="text-sm bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
                  disabled={authStatus === "loading" || !newDisplayName.trim()}
                >
                  {authStatus === "loading" ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelClick}
                  className="text-sm bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded cursor-pointer"
                  disabled={authStatus === "loading"}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        <h1 className="text-xl sm:text-3xl font-bold mb-2">Your paintings</h1>
        <div className="w-full border-b-2 border-black mb-4 sm:mb-8"></div>

        {/* Handle loading state */}
        {paintingsStatus === "loading" && (
          <div className="w-full min-h-[200px] flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-8 my-4 text-center">
            {/* You can add an icon here if you have one, e.g., <img src="/assets/no_paintings_icon.png" alt="No paintings" className="w-16 h-16 mb-4 opacity-50" /> */}
            <p className="text-lg text-gray-500">Loading your paintings...</p>
          </div>
        )}

        {/* Handle error state */}
        {paintingsStatus === "failed" && (
          <div className="w-full min-h-[200px] flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-8 my-4 text-center">
            {/* You can add an icon here if you have one, e.g., <img src="/assets/no_paintings_icon.png" alt="No paintings" className="w-16 h-16 mb-4 opacity-50" /> */}
            <p className="text-lg text-gray-500">
              Failed to load your paintings: {paintingsError}
            </p>
          </div>
        )}

        {/* Show paintings if available and loaded */}
        {paintingsStatus === "succeeded" && (
          <div className="w-full">
            {paintings && paintings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                {paintings.map((painting) => (
                  <div key={painting.id} className="text-left">
                    <PaintingDisplay painting={painting} />
                    <div className="text-sm truncate" title={painting.title}>
                      {painting.title || "Untitled"}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {painting.authorName || "Unknown artist"}
                    </div>
                    {painting.savedQuote && (
                      <div
                        className="text-xs italic mt-1 text-gray-600 truncate"
                        title={painting.savedQuote}
                      >
                        "{painting.savedQuote}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full min-h-[200px] flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-8 my-4 text-center">
                {/* You can add an icon here if you have one, e.g., <img src="/assets/no_paintings_icon.png" alt="No paintings" className="w-16 h-16 mb-4 opacity-50" /> */}
                <p className="text-lg text-gray-500">
                  You haven't created any paintings yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
