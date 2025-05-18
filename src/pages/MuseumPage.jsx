import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";
import { Suspense } from "../components/Suspense";
import { NavBar } from "../components/NavBar";

// Painting Card Component - extracted and reusable
const PaintingCard = ({
  painting,
  onSelect,
  onToggleLike,
  currentUser,
  userLikedPaintings,
  likesLoading,
}) => {
  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click from bubbling up to the Link
    if (currentUser) {
      onToggleLike(painting.id, currentUser.uid);
    }
  };

  return (
    <Link
      to="/details"
      className="flex flex-col p-6 shadow-xl aspect-[2.1/3] cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out"
      onClick={() => onSelect(painting.id)}
    >
      {/* Fixed height container for the image with aspect ratio preservation */}
      <div className="flex flex-col h-full">
        <PaintingDisplay painting={painting} />

        <div className="flex flex-col justify-between h-full items-stretch">
          {/* Text content container with ellipsis for overflow */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h2 className="text-2xl">{painting.title}</h2>
            <p className="mt-1 text-sm text-right font-bold">
              - {painting.authorName}
            </p>
            <p className="text-sm italic line-clamp-2 mb-auto">
              "{painting.savedQuote.content}"
            </p>
          </div>
          {/* Like button */}
          <div className="flex items-center self-end">
            <button
              onClick={handleLikeClick}
              className={`cursor-pointer text-xl sm:text-3xl transition transform duration-200 hover:scale-110`}
              disabled={!currentUser || likesLoading}
            >
              <img
                src={
                  userLikedPaintings?.includes(painting.id)
                    ? "/assets/heart.png"
                    : "/assets/heart_empty.png"
                }
                className="w-10 h-10"
                alt={
                  userLikedPaintings?.includes(painting.id) ? "Unlike" : "Like"
                }
              />
            </button>
            <span className="flex items-center text-0.5xl">
              {likesLoading ? "..." : painting.likesCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export function MuseumPage({
  paintings,
  onSelectPainting,
  isLoading,
  error,
  onToggleLike,
  currentUser,
  userLikedPaintings,
  topPaintings,
  onFetchUserLikes,
  onFetchAllPaintings,
  likesLoading,
}) {
  // Local state for pagination
  const [startIndex, setStartIndex] = useState(0);
  const [paintingsPerPage, setPaintingsPerPage] = useState(3);

  // tab state
  const [activeTab, setActiveTab] = useState("museum");
  // Responsive layout state
  const [layoutType, setLayoutType] = useState("desktop");

  // Derived pagination state
  const isFirstPage = startIndex === 0;
  const isLastPage = startIndex + paintingsPerPage >= paintings.length;

  // Calculate number of paintings per row based on screen width
  useEffect(() => {
    onFetchAllPaintings();
    if (currentUser) {
      onFetchUserLikes(currentUser.uid);
    }

    function handleResize() {
      if (window.innerWidth >= 1024) {
        setLayoutType("desktop"); // 3 paintings per row
      } else if (window.innerWidth >= 768) {
        setLayoutType("tablet"); // 2 paintings per row
      } else {
        setLayoutType("mobile"); // 1 painting per row
      }
    }

    // Initialize and set up listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pagination handlers
  const handleNextClick = () => {
    if (!isLastPage) {
      setStartIndex(startIndex + paintingsPerPage);
    }
  };

  const handlePrevClick = () => {
    if (!isFirstPage) {
      setStartIndex(startIndex - paintingsPerPage);
    }
  };

  // Get current paintings to display
  const getCurrentPaintings = () => {
    if (layoutType === "mobile" || layoutType === "tablet") {
      return paintings;
    } else {
      return paintings.slice(startIndex, startIndex + paintingsPerPage);
    }
  };

  // Handle responsive layout rendering
  const renderPaintings = () => {
    const currentPaintings = getCurrentPaintings();

    if (layoutType === "desktop") {
      return (
        <div className="flex items-left">
          {/* Left Arrow */}
          <div className="mr-6 flex-shrink-0 self-center">
            <button
              onClick={handlePrevClick}
              className={`${!isFirstPage ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
              disabled={isFirstPage}
            >
              <img
                src="/assets/left_arrow.png"
                className="w-auto h-10"
                alt="Previous"
              />
            </button>
          </div>

          {/* Paintings - display with proper alignment */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {currentPaintings.map((painting) => (
              <div key={painting.id}>
                <PaintingCard
                  painting={painting}
                  onSelect={onSelectPainting}
                  onToggleLike={onToggleLike}
                  currentUser={currentUser}
                  userLikedPaintings={userLikedPaintings}
                  likesLoading={likesLoading}
                />
              </div>
            ))}
            {/* Add empty placeholders to maintain grid structure */}
            {[...Array(3 - currentPaintings.length)].map((_, index) => (
              <div key={`empty-${index}`} className="invisible"></div>
            ))}
          </div>

          {/* Right Arrow */}
          <div className="ml-4 flex-shrink-0 self-center">
            <button
              onClick={handleNextClick}
              className={`${!isLastPage ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
              disabled={isLastPage}
            >
              <img
                src="/assets/right_arrow.png"
                className="w-auto h-10"
                alt="Next"
              />
            </button>
          </div>
        </div>
      );
    } else {
      // Tablet/Mobile layout - vertical grid with no arrows
      return (
        <div className="grid gap-8">
          <div
            className={`grid grid-cols-1 ${layoutType === "tablet" ? "md:grid-cols-2" : ""} gap-4`}
          >
            {paintings.map((painting) => (
              <div key={painting.id}>
                <PaintingCard
                  painting={painting}
                  onSelect={onSelectPainting}
                  onToggleLike={onToggleLike}
                  currentUser={currentUser}
                  userLikedPaintings={userLikedPaintings}
                  likesLoading={likesLoading}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="font-pixel max-h-[calc(100vh-4rem)] px-8 pt-8">
      <NavBar backLocation="world" title="Museum" />
      {/* Add tab navigation */}
      <div className="flex space-x-4 mb-6 mt-4">
        <button
          className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
            activeTab === "museum"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("museum")}
        >
          MUSEUM
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-bold cursor-pointer ${
            activeTab === "hall-of-fame"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("hall-of-fame")}
        >
          HALL OF FAME
        </button>
      </div>

      <div className="font-pixel w-full pb-8 lg:pb-12">
        {/* Show content based on active tab */}
        {activeTab === "museum" ? (
          <>
            {/* Loading and error states */}
            {isLoading && Suspense("loading", "Loading paintings...")}
            {error && <p className="text-red-500">Error: {error}</p>}
            {/* Render paintings based on screen size */}
            {!isLoading && !error && renderPaintings()}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topPaintings.map((painting, index) => (
                <div key={painting.id} className="relative">
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                    #{index + 1}
                  </div>
                  <PaintingCard
                    painting={painting}
                    onSelect={onSelectPainting}
                    onToggleLike={onToggleLike}
                    currentUser={currentUser}
                    userLikedPaintings={userLikedPaintings}
                    likesLoading={likesLoading}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
