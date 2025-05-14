import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

// Painting Card Component
const PaintingCard = ({ painting, onSelect }) => {
  return (
    <Link
      to="/details"
      className="flex flex-col p-6 shadow-2xl"
      onClick={() => onSelect(painting.id)}
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
  error
}) {
  // Responsive layout state
  const [layoutType, setLayoutType] = useState('desktop'); 

  
  // Calculate number of paintings per row based on screen width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setLayoutType('desktop'); // 3 paintings per row
      } else if (window.innerWidth >= 768) {
        setLayoutType('tablet'); // 2 paintings per row
      } else {
        setLayoutType('mobile'); // 1 painting per row
      }
    }
    
    // Initialize and set up listener
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate paintings per row based on layout
  const getPaintingsPerRow = () => {
    switch (layoutType) {
      case 'desktop': return 3;
      case 'tablet': return 2;
      case 'mobile': return 1;
      default: return 3;
    }
  };
  
  // Get current paintings to display
  const getCurrentPaintings = () => {
    if (layoutType === 'mobile' || layoutType === 'tablet') {
      return paintings;
    }
    else {
      const startIdx = startIndex || 0;
      return paintings.slice(startIdx, startIdx + paintingsPerPage); // Use paintingsPerPage from props
    }
  };
  
  // Handle responsive layout rendering
  const renderPaintings = () => {
    const currentPaintings = getCurrentPaintings(); 
    
    
    if (layoutType === 'desktop') {
      return ( // Added return statement
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
      className={`flex flex-col ${currentPaintings.length < 3 ? "w-[30%]" : "w-[31%]"} p-6 shadow-2xl`}
      onClick={() => onSelectPainting(painting.id)} // Changed to use prop
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
    );
  }
    else {
      // Tablet/Mobile layout - vertical grid with no arrows
      return (
        <div className="grid gap-8">
          {/* Calculate grid columns based on layout */}
          <div className={`grid grid-cols-1 ${layoutType === 'tablet' ? 'md:grid-cols-2' : ''} gap-8`}>
            {paintings.map((painting) => (
              <div key={painting.id}>
                <PaintingCard
                  painting={painting}
                  onSelect={onSelectPainting} 
                />
              </div>
            ))}
          </div>
        </div>
      );
    }
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

      <div className="font-pixel px-6 mx-auto w-full max-w-[1024px]">
        <h1 className="text-6xl font-bold mb-8">MUSEUM</h1>
        
        {/* Render paintings based on screen size */}
        {renderPaintings()}
      </div>
    </div>
  );
}