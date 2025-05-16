import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";
import { Suspense } from "../components/Suspense";
import { NavBar } from "../components/NavBar";

// Painting Card Component - extracted and reusable
const PaintingCard = ({ painting, onSelect,onToggleLike, currentUser, userLiked }) => {
  const handleLikeClick = (e) => {
    e.preventDefault(); 
    if (currentUser) {
      onToggleLike(painting.id, currentUser.uid);
    }
  };

  return (
    <Link
      to="/details"
      className="flex flex-col p-6 shadow-xl aspect-[2.2/3] cursor-pointer overflow-hidden"
      onClick={() => onSelect(painting.id)}
    >
      {/* Fixed height container for the image with aspect ratio preservation */}
      <div className="relative">
      <PaintingDisplay painting={painting} />

      {/* Text content container with ellipsis for overflow */}
      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-2xl">{painting.title}</h2>
        <p className="mt-1 text-sm text-right font-bold">
          - {painting.authorName}
        </p>
        <p className="text-sm italic line-clamp-2 mt-auto">
          "{painting.savedQuote.content}"
        </p>

        {/* Like button */}
        <button
          onClick={handleLikeClick}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors ${
            !currentUser ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!currentUser}
          title={!currentUser ? 'Please log in to like paintings' : ''}
        >
          <span className="text-xl">
          {(painting.likesCount || 0)}
            {userLiked ? '❤️' : '🤍'}
          </span>
        </button>
        </div>
      </div>
    </Link>
  );
};

export function MuseumPage({
  paintings,
  startIndex,
  paintingsPerPage,
  isFirstPage,
  isLastPage,
  onPrevClick,
  onNextClick,
  onSelectPainting,
  onToggleLike,
  isLoading,
  error,
  currentUser,
  userLiked,
  topPaintings = [], 
}) {
  // tab state
  const [activeTab, setActiveTab] = useState('museum');
  // Responsive layout state
  const [layoutType, setLayoutType] = useState("desktop");

  // Calculate number of paintings per row based on screen width
  useEffect(() => {
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

  // Get current paintings to display
  const getCurrentPaintings = () => {
    if (layoutType === "mobile" || layoutType === "tablet") {
      return paintings;
    } else {
      const startIdx = startIndex || 0;
      return paintings.slice(startIdx, startIdx + paintingsPerPage);
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
              onClick={onPrevClick}
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
                  userLiked={userLiked}
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
              onClick={onNextClick}
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
          userLiked={userLiked}
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
      <NavBar backLocation="world" />
      {/* Add tab navigation */}
      <div className="flex space-x-4 mb-6 mt-4">
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${
            activeTab === 'museum' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('museum')}
        >
          MUSEUM
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${
            activeTab === 'hall-of-fame' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('hall-of-fame')}
        >
          HALL OF FAME
        </button>
      </div>

      <div className="font-pixel w-full pb-8 lg:pb-12">
        {/* Show content based on active tab */}
        {activeTab === 'museum' ? (
          <>
            <h1 className="text-3xl font-bold mb-4">MUSEUM</h1>
            {/* Loading and error states */}
            {isLoading && Suspense("loading", "Loading paintings...")}
            {error && <p className="text-red-500">Error: {error}</p>}
            {/* Render paintings based on screen size */}
            {!isLoading && !error && renderPaintings()}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-6">HALL OF FAME</h1>
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
                    userLiked={userLiked}
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

