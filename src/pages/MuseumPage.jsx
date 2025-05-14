import React from "react";
import { Link } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";

export function MuseumPage({
  currentPaintings,
  isFirstPage,
  isLastPage,
  onPrevClick,
  onNextClick,
  onSelectPainting,
}) {
  // Handle painting selection
  const handlePaintingSelectACB = (paintingId) => {
    onSelectPainting(paintingId);
  };

  return (
    <div className="font-pixel">
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

      <div className="font-pixel px-6 mx-auto w-[512px] md:w-[768px] lg:w-[1024px]">
        <h1 className="text-xl sm:text-3xl font-bold">MUSEUM</h1>
      </div>

      {/* Paintings grid with scroll arrows */}
      <div className="flex items-left">
        {/* Left Arrow */}
        <div className="mr-6 flex-shrink-0 self-center">
          <button
            onClick={onPrevClick}
            className={`${!isFirstPage ? "" : "opacity-50 cursor-not-allowed"}`}
            disabled={isFirstPage}
          >
            <img
              src="/assets/left_arrow.png"
              className="w-10 h-15"
              alt="Previous"
            />
          </button>
        </div>

        {/* Paintings - display with proper alignment */}
        <div
          className={`flex flex-grow ${currentPaintings.length < 3 ? "justify-start" : "justify-between"} gap-8`}
        >
          {currentPaintings.map((painting) => (
            <Link
              to="/details"
              key={painting.id}
              className={`flex flex-col ${currentPaintings.length < 3 ? "w-[30%]" : "w-[31%]"} p-6 shadow-2xl `}
              onClick={() => handlePaintingSelectACB(painting.id)}
            >
              <PaintingDisplay painting={painting} />
              <h2 className="text-xl sm:text-3xl mb-2">{painting.title}</h2>
              <div className="mb-4 h-17">
                <p className="text-sm italic">"{painting.savedQuote}"</p>
                <p className="mt-2 text-sm">- {painting.author}</p>
              </div>
              <p className="text-xs leading-tight mt-4">
                {painting.authorNotes}
              </p>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <div className="ml-4 flex-shrink-0 self-center">
          <button
            onClick={onNextClick}
            className={`${!isLastPage ? "" : "opacity-50 cursor-not-allowed"}`}
            disabled={isLastPage}
          >
            <img
              src="/assets/right_arrow.png"
              className="w-10 h-15"
              alt="Next"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
