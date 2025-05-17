import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";

// Painting Card Component - extracted and reusable
const PaintingCard = ({ painting, onSelect }) => {
  return (
    <Link
      to="/details"
      className="flex flex-col p-6 shadow-xl aspect-[2.2/3] cursor-pointer overflow-hidden"
      onClick={() => onSelect(painting.id)}
    >
      {/* Fixed height container for the image with aspect ratio preservation */}
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
  isLoading,
  error,
}) {
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
          <div className="grid grid-cols-3 gap-4">
            {currentPaintings.map((painting) => (
              <div key={painting.id}>
                <PaintingCard painting={painting} onSelect={onSelectPainting} />
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
                <PaintingCard painting={painting} onSelect={onSelectPainting} />
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="font-pixel max-h-[calc(100vh-8rem)]">
      {/* Back Button */}
      <Link
        to="/world"
        className="flex transition transform duration-200 items-center"
      >
        <img src="/assets/back_arrow.png" className="h-8" alt="Back" />
        <div className="pl-4 hover:underline flex text-xl sm:text-3xl">
          Back to world
        </div>
      </Link>

      <div className="font-pixel w-full pb-8 lg:pb-4 pt-4">
        <h1 className="text-3xl font-bold mb-4">MUSEUM</h1>

        {/* Loading and error states */}
        {isLoading && <p>Loading paintings...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Render paintings based on screen size */}
        {!isLoading && !error && renderPaintings()}
      </div>
    </div>
  );
}
