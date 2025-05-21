import React, { useState, useEffect, useRef } from "react";
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
  className = "",
}) => {
  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click from bubbling up to the Link
    if (currentUser) {
      onToggleLike(painting.id, currentUser.uid);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Link
      to="/details"
      className={
        `flex flex-col p-4 shadow-xl cursor-pointer overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out` +
        " " +
        className
      }
      onClick={() => onSelect(painting.id)}
    >
      {/* Fixed height container for the image with aspect ratio preservation */}
      <div className="flex flex-col h-full">
        <PaintingDisplay painting={painting} />

        <div className="flex flex-col justify-between h-full items-stretch">
          {/* Text content container with ellipsis for overflow */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <h2 className="text-2xl line-clamp-1">{painting.title}</h2>
            <p className="mt-1 text-sm text-right font-bold">
              - {painting.authorName}
            </p>
            {/* Always render the date element with consistent height */}
            <p className="text-xs text-gray-500 text-right h-4">
              {painting.createdAt ? formatDate(painting.createdAt) : "\u00A0"}
            </p>

            {/* Always render the quote element with consistent height - two lines */}
            <p className="text-sm italic line-clamp-2 mb-auto min-h-[2.5rem]">
              {painting.savedQuote && painting.savedQuote.content
                ? `"${painting.savedQuote.content}"`
                : "\u00A0\n\u00A0"}
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
              {/* {likesLoading ? "..." : painting.likesCount} */}
              {painting.likesCount}
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

  // Transition state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tabContent, setTabContent] = useState("museum"); // The currently visible content

  // Loading transition state
  const [contentOpacity, setContentOpacity] = useState(isLoading ? 0 : 1);

  // Responsive layout state
  const [layoutType, setLayoutType] = useState("desktop");

  // Track previous loading state
  const prevLoadingRef = useRef(isLoading);

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

  useEffect(() => {
    // If loading state has changed
    if (prevLoadingRef.current !== isLoading) {
      if (isLoading) {
        console.log("Loading started");
        setContentOpacity(0); // Fade out content
      } else {
        console.log("Loading finished");
        // Transitioning from loading to content
        setTimeout(() => {
          setContentOpacity(1); // Fade in content
        }, 50);
      }
      prevLoadingRef.current = isLoading;
    }
  }, [isLoading]);

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

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;

    setIsTransitioning(true);

    // Change the active tab immediately (for the button highlight)
    setActiveTab(tab);

    // Wait for the fade-out animation, then change content
    setTimeout(() => {
      setTabContent(tab);
      // Then start fade-in animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
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
              className={`${!isFirstPage ? "cursor-pointer hover:scale-110" : "opacity-40 cursor-not-allowed"} transition-transform duration-200`}
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
                  className="border-2 rounded-xl border-gray-300"
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
              className={`${!isLastPage ? "cursor-pointer hover:scale-110" : "opacity-40 cursor-not-allowed"} transition-transform duration-200`}
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
                  className="border-2 rounded-xl border-gray-300"
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
          className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors duration-300 ${
            activeTab === "museum"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabChange("museum")}
        >
          MUSEUM
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors duration-300 ${
            activeTab === "hall-of-fame"
              ? "bg-yellow-400 text-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleTabChange("hall-of-fame")}
        >
          HALL OF FAME
        </button>
      </div>

      <div className="font-pixel w-full pb-8 lg:pb-12">
        {/* Loading state with transition */}
        <div
          className={`transition-opacity duration-300 ${isLoading ? "opacity-100" : "opacity-0"} ${isLoading ? "" : "hidden"}`}
        >
          {Suspense("loading", "Loading paintings...")}
        </div>

        {/* Main content with transitions */}
        <div
          className={`transition-opacity duration-300 ${isTransitioning || contentOpacity === 0 ? "opacity-0" : "opacity-100"} ${isLoading ? "hidden" : ""}`}
        >
          {error && <p className="text-red-500">Error: {error}</p>}
          {!error && tabContent === "museum" ? (
            // Museum content
            renderPaintings()
          ) : (
            // Hall of Fame content
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topPaintings.map((painting, index) => {
                // Define badge and border colors based on rank
                const badgeColor =
                  index === 0
                    ? "bg-yellow-400"
                    : index === 1
                      ? "bg-gray-300"
                      : index === 2
                        ? "bg-amber-600"
                        : "bg-blue-300";

                // Extract just the color name for the border
                const borderColor =
                  index === 0
                    ? "border-yellow-400"
                    : index === 1
                      ? "border-gray-300"
                      : index === 2
                        ? "border-amber-600"
                        : "border-blue-300";

                return (
                  <div key={painting.id} className="relative">
                    <div
                      className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold z-10 text-2xl ${badgeColor}`}
                    >
                      #{index + 1}
                    </div>
                    <PaintingCard
                      painting={painting}
                      onSelect={onSelectPainting}
                      onToggleLike={onToggleLike}
                      currentUser={currentUser}
                      userLikedPaintings={userLikedPaintings}
                      likesLoading={likesLoading}
                      className={`border-4 rounded-xl ${borderColor} p-0`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
