import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentPaintings,
  selectIsFirstPage,
  selectIsLastPage,
  nextPaintings,
  prevPaintings,
  selectPainting,
} from "../app/slices/museumSlice";

// Separate PaintingFrame component
const PaintingFrame = ({ colorMatrix = [] }) => {
  // Define a fixed grid structure - 4 rows x 8 columns for 32 elements
  const rows = 4;
  const cols = 8;

  // Create a grid display that's always rectangular
  return (
    <div className="border-2 border-black mb-4 aspect-square w-full">
      <div className="w-full h-full flex flex-col">
        {Array(rows)
          .fill()
          .map((_, rowIndex) => (
            <div key={rowIndex} className="flex flex-1">
              {Array(cols)
                .fill()
                .map((_, colIndex) => {
                  const index = rowIndex * cols + colIndex;
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="flex-1"
                      style={{
                        backgroundColor:
                          index < colorMatrix.length
                            ? colorMatrix[index]
                            : "#ffffff",
                      }}
                    />
                  );
                })}
            </div>
          ))}
      </div>
    </div>
  );
};

export function MuseumPage({ onSelectPainting }) {
  const dispatch = useDispatch();
  const displayedPaintings = useSelector(selectCurrentPaintings);
  const isFirstPage = useSelector(selectIsFirstPage);
  const isLastPage = useSelector(selectIsLastPage);

  // Handle right arrow click to scroll to next set of paintings
  const handleNextClickACB = () => {
    dispatch(nextPaintings());
  };

  // Handle left arrow click to scroll back to the previous set of paintings
  const handlePrevClickACB = () => {
    dispatch(prevPaintings());
  };

  // Handle painting selection
  const handlePaintingSelectACB = (paintingId) => {
    onSelectPainting(paintingId);
  };

  return (
    <div className="font-pixel p-6">
      {/* Back Button */}
      <Link
        to="/world"
        className="flex transition transform duration-200 pb-4 items-center"
      >
        <img src="/assets/back_arrow.png" className="h-8" alt="Back" />
        <div className="pl-4 hover:underline flex text-1xl">Back to world</div>
      </Link>

      <div className="font-pixel px-6 mx-auto w-[512px] md:w-[768px] lg:w-[1024px]">
        <h1 className="text-6xl font-bold">MUSEUM</h1>
      </div>

      {/* Paintings grid with scroll arrows */}
      <div className="flex items-left">
        {/* Left Arrow */}
        <div className="mr-6 flex-shrink-0 self-center">
          <button
            onClick={handlePrevClickACB}
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
          className={`flex flex-grow ${displayedPaintings.length < 3 ? "justify-start" : "justify-between"} gap-8`}
        >
          {displayedPaintings.map((painting) => (
            <Link
              to="/details"
              key={painting.id}
              className={`flex flex-col ${displayedPaintings.length < 3 ? "w-[30%]" : "w-[31%]"} p-6 shadow-2xl `}
              onClick={() => handlePaintingSelectACB(painting.id)}
            >
              <PaintingFrame colorMatrix={painting.colorMatrix} />
              <h2 className="text-3xl mb-2">{painting.title}</h2>
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
            onClick={handleNextClickACB}
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
