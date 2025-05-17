import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { PaintingDisplay } from "../components/PaintingDisplay";
import { Suspense } from "../components/Suspense";
import { NavBar } from "../components/NavBar";

export function ProfilePage({
  user,
  authStatus,
  authError,
  paintings,
  paintingsStatus: paintingsLoading,
  paintingsError,
  onChangeDisplayName,
  fetchUserPaintings,
  onSelectPainting,
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

  const handlePaintingSelectACB = (paintingId) => {
    onSelectPainting(paintingId);
  };

  if (authStatus !== "loading" && !user) {
    console.log("Auth status: ", authStatus);
    return <Navigate to="/login" replace />;
  } else {
    return (
      <div className="font-pixel mx-auto w-full max-h-[calc(100vh-4rem)] p-8">
        <NavBar showProfile={false} title="Profile" />

        {authStatus === "loading" &&
          Suspense("loading", "Loading your profile...")}

        {authStatus !== "loading" && (
          <>
            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 pt-4 w-full">
              {/* Profile Picture */}
              <img
                src={user.photoURL || "/assets/default_avatar.png"} // Provide a path to a default avatar
                alt="Profile"
                className="aspect-square w-1/3 sm:w-14 self-center bg-gray-300 rounded-full mr-4 border border-black" // Added border and bg as fallback
              />
              <div className="w-full">
                <div className="flex items-baseline space-x-2">
                  {!isEditing ? (
                    <>
                      <h1 className="text-xl sm:text-3xl font-bold">
                        {user.displayName || "Anonymous"}
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
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="font-bold border rounded border-black px-2 py-1 w-full"
                        maxLength={30} // Add a reasonable max length
                      />
                      <button
                        onClick={handleSaveClick}
                        className="text-sm bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
                        disabled={
                          authStatus === "loading" || !newDisplayName.trim()
                        }
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
                <h1 className="sm:text-xl break-all overflow-hidden">
                  {user.email}
                </h1>
              </div>
            </div>
            {/* Gallery */}
            <h1 className="text-xl sm:text-2xl font-bold mb-2 w-full">
              Your paintings
            </h1>
            <div className="w-full border-b-2 border-black mb-8"></div>
            {/* Handle loading state */}
            {paintingsLoading && !paintingsError && (
              <div className="w-full min-h-[250px] flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-8 my-4 text-center">
                {/* You can add an icon here if you have one, e.g., <img src="/assets/no_paintings_icon.png" alt="No paintings" className="w-16 h-16 mb-4 opacity-50" /> */}
                <p className="text-lg text-gray-500">
                  Loading your paintings...
                </p>
              </div>
            )}
            {/* Handle error state */}
            {paintingsError && (
              <div className="w-full min-h-[200px] flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md p-8 my-4 text-center">
                {/* You can add an icon here if you have one, e.g., <img src="/assets/no_paintings_icon.png" alt="No paintings" className="w-16 h-16 mb-4 opacity-50" /> */}
                <p className="text-lg text-gray-500">
                  Failed to load your paintings: {paintingsError}
                </p>
              </div>
            )}
            {/* Show paintings if available and loaded */}
            {!paintingsLoading && !paintingsError && (
              <div className="w-full">
                {paintings && paintings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 min-w-[200px]">
                    {paintings.map((painting) => (
                      <Link
                        to="/details"
                        key={painting.id}
                        className="text-left mb-4 hover:scale-105 transition-transform duration-200 ease-in-out"
                        onClick={() => handlePaintingSelectACB(painting.id)}
                      >
                        <PaintingDisplay painting={painting} />
                        <div
                          className="text-sm truncate"
                          title={painting.title}
                        >
                          {painting.title || "Untitled"}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {painting.authorName || "Unknown artist"}
                        </div>
                        {painting.savedQuote.content && (
                          <div
                            className="text-xs italic mt-1 text-gray-600 truncate"
                            title={painting.savedQuote.content}
                          >
                            "{painting.savedQuote.content}"
                          </div>
                        )}
                      </Link>
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
          </>
        )}
      </div>
    );
  }
}
