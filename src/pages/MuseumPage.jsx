import React, { useState } from "react";
import { Link } from "react-router-dom";

export function MuseumPage({ 
  // Props from Redux --> declare them to be used in the function to display the view
  currentPaintings, 
  isFirstPage, 
  isLastPage, 
  onSelectPainting, //for later? when connecting to details maybe
  onNextClick, 
  onPrevClick 
}) {

  // Handle right arrow click to scroll to next set of paintings
  const handleNextClickACB = () => {
    onNextClick();
    console.log("next click");
  };

    //Handle left arrow click to scroll back to the previous set of paintigs
    const handlePrevClickACB = () => {
      onPrevClick();
      console.log("prev click");
    };

    /*
  // Get current paintings to display
  const currentPaintings = paintings.slice(
    startIndex,
    startIndex + paintingsPerPage,
  );

  // Determine if we're on the last page
  const isLastPage = startIndex + paintingsPerPage >= paintings.length;

  // Determine if we're on the first page
  const isFirstPage = startIndex === 0;
*/


  return (
    <div className="font-pixel p-6">
       {/* Back Button */}
       <Link
          to="/world"
          className="flex transition transform duration-200 pb-4 items-center"
        >
          <img src="/assets/back_arrow.png" className="h-8"></img>
          <div className="pl-4 hover:underline flex text-1xl">
            Back to world
          </div>
        </Link>
      <div className="font-pixel px-6 mx-auto w-[512px] md:w-[768px] lg:w-[1024px]">
       

        {/* Museum Title */}
        <h1 className="text-6xl font-bold">MUSEUM</h1>
      </div>

      {/* Paintings grid with scroll arrows */}
      <div className="flex items-left ">
        {/* Left Arrow - only show if not on the first page */}
        <div className="mr-6 flex-shrink-0 self-center">
          <button
            onClick={handlePrevClickACB}
            className={`${!isFirstPage ? "" : "opacity-50 cursor-not-allowed"}`}
            disabled={!isFirstPage ? false : true}
          >
            <img
              src="/assets/left_arrow.png"
              className="w-10 h-15"
              alt="Previous"
            />
          </button>
        </div>

        {/* Paintings */}
        <div className="flex flex-grow justify-start gap-6">
          {currentPaintings.map((painting) => (
            <Link
              to="/details"
              key={painting.id}
              className="flex flex-col w-[calc(33.333%-1rem)] p-4 shadow-2xl"
            >
              {/* Painting Frame */}
              <div className="border-2 border-black mb-4 aspect-square w-full">
                <div className="w-full h-full">
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
              </div>

              {/* Painting Title */}
              <h2 className="text-3xl mb-2">{painting.title}</h2>

              {/* Quote */}
              <div className="mb-4 h-17">
                <p className=" text-sm italic">"{painting.savedQuote}"</p>
                <p className="mt-2  text-sm">- {painting.author}</p>
              </div>

              {/* Description */}
              <p className=" text-xs leading-tight mt-4">
                {painting.authorNotes ||
                  "There was a lot of different types among wolves in the Late Pleistocene.(1) The dingo is also a dog, but many dingos have become wild animals again and live in the wild, away from humans (parts of Australia).(5)"}
              </p>
            </Link>
          ))}
        </div>

        {/* Right Arrow - only show if not on the last page */}

        <div className="ml-4 flex-shrink-0 self-center">
          <button
            onClick={handleNextClickACB}
            className={`${!isLastPage ? "" : "opacity-50 cursor-not-allowed"}`}
            disabled={!isLastPage ? false : true}
          >
            <img
              src="assets/right_arrow.png"
              className="w-10 h-15"
              alt="Previous"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
