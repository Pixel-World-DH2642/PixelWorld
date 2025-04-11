import React, { useState } from 'react';

export function MuseumPage({ paintings, onSelectPainting }) {
  function backnavACB() {
    window.location.hash = "#/world";
  }
  
  // Dummy data
  paintings = [
    {
      id: 'painting1',
      title: 'Beauty',
      colorMatrix: Array(32).fill().map(() =>
        Array(32).fill().map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
      ),
      savedQuote: 'Art washes away from the soul the dust of everyday life.',
      author: 'PicassoFan123',
      date: Date.now() - 100000000,
      authorNotes: 'Inspired by the colors of a Spanish sunset.',
      likedBy: ['user1', 'user2', 'user3']
    },
    {
      id: 'painting2',
      title: 'Silence in Spring',
      colorMatrix: Array(32).fill().map(() =>
        Array(32).fill().map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
      ),
      savedQuote: 'Every artist was first an amateur.',
      author: 'art_lover_98',
      date: Date.now() - 50000000,
      authorNotes: 'My first attempt using only shades of blue.',
      likedBy: ['user5']
    },
    {
      id: 'painting3',
      title: 'Wind',
      colorMatrix: Array(32).fill().map(() =>
        Array(32).fill().map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
      ),
      savedQuote: 'Creativity takes courage.',
      author: 'beginner_painter',
      date: Date.now() - 2000000,
      authorNotes: 'Experimented with pixel symmetry.',
      likedBy: []
    },
    {
      id: 'painting4',
      title: 'Horse',
      colorMatrix: Array(32).fill().map(() =>
        Array(32).fill().map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
      ),
      savedQuote: 'Two things are infinite: the universe and human stupidity; and Im not sure about the universe.',
      author: 'Painter345',
      date: Date.now() - 100000000,
      authorNotes: 'I painted this on a vacation',
      likedBy: ['user1', 'user3']
    },
    {
      id: 'painting5',
      title: 'Love in  the sky',
      colorMatrix: Array(32).fill().map(() =>
        Array(32).fill().map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
      ),
      savedQuote: 'I love to fly',
      author: 'art_enthuisast_98',
      date: Date.now() - 50000000,
      authorNotes: 'I like to paint with this app',
      likedBy: ['user5', 'PicassoFan123']
    }
  ];


  const [startIndex, setStartIndex] = useState(0);
  const paintingsPerPage=3;
  // Handle right arrow click to scroll to next set of paintings
  const handleNextClickACB = () => {
    if (startIndex + paintingsPerPage < paintings.length) {
      setStartIndex(startIndex + paintingsPerPage);
    } 
    console.log('next click')
  };

  // Get current paintings to display
  const currentPaintings = paintings.slice(startIndex, startIndex + paintingsPerPage);

  // Determine if we're on the last page
  const isLastPage = startIndex + paintingsPerPage >= paintings.length;
  
  // Determine if we're on the first page
  const isFirstPage = startIndex === 0;

  //Handle left arrow click to scroll back to the previous set of paintigs
  const handlePrevClickACB = () => {
      setStartIndex(startIndex - paintingsPerPage);
    
    console.log('prev click')
  };

  return (
    <div className="bg-white p-8 min-h-screen">
      {/* Back Button */}
      <button 
        onClick={backnavACB}
        className="flex items-center text-sm font-mono mb-6"
      >
        <img src="museum_back_arrow.png" alt="Back arrow" className="w-10 h-6 mr-2" />
        Back to Pixelworld
      </button>
      
      {/* Museum Title */}
      <h1 className="text-6xl font-bold mt-6 mb-6">MUSEUM</h1>
      
      {/* Paintings grid with scroll arrows */}
      <div className="flex items-left mb-8">
        
          {/* Left Arrow - only show if not on the first page */}
        { !isFirstPage && (
          <div className="mr-6 mb-25 self-center">
            <button onClick={handlePrevClickACB} className="font-mono">
              <img src="museum_left_arrow.png" className="w-10 h-15" alt="Previous" />
            </button>
          </div>
        )}

        {/* Paintings */}
        <div className="flex flex-grow justify-start gap-6">
          {currentPaintings.map(painting => (
            <div key={painting.id} className="flex flex-col w-1/3">
              {/* Painting Frame */}
              <div className="border-2 border-black mb-4 aspect-square w-full">
                <div className="w-full h-full">
                  {painting.colorMatrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex" style={{height: `${100/painting.colorMatrix.length}%`}}>
                      {row.map((color, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          style={{
                            backgroundColor: color,
                            width: `${100/row.length}%`,
                            height: '100%'
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Painting Title */}
              <h2 className="text-3xl font-mono mb-2">{painting.title}</h2>
              
              {/* Quote */}
              <div className="mb-4 h-17">
                <p className="font-mono text-sm italic">"{painting.savedQuote}"</p>
                <p className="mt-2 font-mono text-sm">- {painting.author}</p>
              </div>
              
              {/* Description */}
              <p className="font-mono text-xs leading-tight mt-4">
                {painting.authorNotes || "There was a lot of different types among wolves in the Late Pleistocene.(1) The dingo is also a dog, but many dingos have become wild animals again and live in the wild, away from humans (parts of Australia).(5)"}
              </p>
            </div>
          ))}
        </div>

         {/* Right Arrow - only show if not on the last page */}
        { !isLastPage && (
          <div className="ml-4 mb-25 self-center">
            <button onClick={handleNextClickACB} className="font-mono">
              <img src="museum_right_arrow.png" className="w-10 h-15" alt="Next" />
            </button>
          </div>
        )}

      
        </div>
      </div>
 
    
      
  );
}