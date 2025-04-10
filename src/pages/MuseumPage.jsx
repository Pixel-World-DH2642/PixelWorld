export function MuseumPage({ paintings, onSelectPainting }) {
  function backnavACB() {
    window.location.hash = "#/world";
  }
  
  // Local paintings data if not provided via props
  paintings = paintings || [
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
    }
  ];

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
      
      {/* Paintings Grid with Right Arrow */}
      <div className="flex items-center mb-8">
        {/* Paintings */}
        <div className="flex flex-grow justify-between gap-6">
          {paintings.map(painting => (
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
              <div className="mb-2">
                <p className="font-mono text-sm">"{painting.savedQuote}"</p>
                <p className="font-mono text-sm">- {painting.author}</p>
              </div>
              
              {/* Description */}
              <p className="font-mono text-xs leading-tight">
                {painting.authorNotes || "There was a lot of different types among wolves in the Late Pleistocene.(1) The dingo is also a dog, but many dingos have become wild animals again and live in the wild, away from humans (parts of Australia).(5)"}
              </p>
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        <div className="ml-4 mb-25 self-center">  {/*I couldn't center it properly to be realtive to the painging (frame) so just incresaed the bottom marging */}
          <button className=" font-mono"><img src="museum_right_arrow.png" className="w-10 h-15" ></img></button>
        </div>
      </div>
    </div>
  );
}