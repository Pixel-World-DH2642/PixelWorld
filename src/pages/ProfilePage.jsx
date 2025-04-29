import { Link, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export function ProfilePage({
  user,
  paintings,
  onChangeDisplayName,
  authStatus,
  authError,
}) {
  // Dummy data
  paintings = [
    {
      id: "painting1",
      title: "Beauty",
      colorMatrix: Array(32)
        .fill()
        .map(() =>
          Array(32)
            .fill()
            .map(
              () =>
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0"),
            ),
        ),
      savedQuote: "Art washes away from the soul the dust of everyday life.",
      author: "PicassoFan123",
      date: Date.now() - 100000000,
      authorNotes: "Inspired by the colors of a Spanish sunset.",
      likedBy: ["user1", "user2", "user3"],
    },
    {
      id: "painting2",
      title: "Silence in Spring",
      colorMatrix: Array(32)
        .fill()
        .map(() =>
          Array(32)
            .fill()
            .map(
              () =>
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0"),
            ),
        ),
      savedQuote: "Every artist was first an amateur.",
      author: "art_lover_98",
      date: Date.now() - 50000000,
      authorNotes: "My first attempt using only shades of blue.",
      likedBy: ["user5"],
    },
    {
      id: "painting3",
      title: "Wind",
      colorMatrix: Array(32)
        .fill()
        .map(() =>
          Array(32)
            .fill()
            .map(
              () =>
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0"),
            ),
        ),
      savedQuote: "Creativity takes courage.",
      author: "beginner_painter",
      date: Date.now() - 2000000,
      authorNotes: "Experimented with pixel symmetry.",
      likedBy: [],
    },
    {
      id: "painting4",
      title: "Horse",
      colorMatrix: Array(32)
        .fill()
        .map(() =>
          Array(32)
            .fill()
            .map(
              () =>
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0"),
            ),
        ),
      savedQuote:
        "Two things are infinite: the universe and human stupidity; and Im not sure about the universe.",
      author: "Painter345",
      date: Date.now() - 100000000,
      authorNotes: "I painted this on a vacation",
      likedBy: ["user1", "user3"],
    },
    {
      id: "painting5",
      title: "Love in  the sky",
      colorMatrix: Array(32)
        .fill()
        .map(() =>
          Array(32)
            .fill()
            .map(
              () =>
                "#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0"),
            ),
        ),
      savedQuote: "I love to fly",
      author: "art_enthuisast_98",
      date: Date.now() - 50000000,
      authorNotes: "I like to paint with this app",
      likedBy: ["user5", "PicassoFan123"],
    },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="font-pixel p-6 mx-auto w-[512px] md:w-[768px] lg:w-[1024px]">
      {/* Back Arrow */}
      <Link
        to="/world"
        className="flex transition transform duration-200 pb-4 items-center"
      >
        <img
          src="/assets/back_arrow.png"
          className="h-8"
          alt="Back arrow"
        ></img>
        <div className="pl-4 hover:underline flex text-3xl">Back to world</div>
      </Link>

      {/* Profile Info */}
      <div className="flex items-center mb-6 mt-8">
        {/* Profile Picture */}
        <img
          src={user.photoURL || "/assets/default_avatar.png"} // Provide a path to a default avatar
          alt="Profile"
          className="w-12 h-12 bg-gray-300 rounded-full mr-4 border border-black" // Added border and bg as fallback
        />
        <div className="flex items-baseline space-x-2">
          {!isEditing ? (
            <>
              <h1 className="text-3xl font-bold">
                {user.displayName || "User"}
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
      <h1 className="text-4xl font-bold mb-2">Your paintings</h1>
      <div className="border-b-2 border-black mb-8"></div>
      {paintings && paintings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Map over the actual paintings array */}
          {paintings.map((painting) => (
            <div key={painting.id} className="text-left">
              <div className="aspect-square border-4 border-black mb-1 overflow-hidden">
                {painting.colorMatrix.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex"
                    style={{
                      height: `${100 / painting.colorMatrix.length}%`,
                    }}
                  >
                    {row.map((color, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          backgroundColor: color,
                          width: `${100 / row.length}%`,
                          height: "100%",
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div
                className="text-sm truncate"
                title={painting.title} // Show full title on hover if truncated
              >
                {painting.title}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't created any paintings yet.</p>
      )}
    </div>
  );
}
