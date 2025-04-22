import { Link } from "react-router-dom";
import { painting } from "../DetailModel";

export function DetailPage({ painting, onLikePainting, onDislikePainting }) {
  if (!painting) {
    return <div className="p-6 text-xl">Loading painting details...</div>;
  }
  return (
    <div className="font-pixel p-6 mx-auto w-[512px] md:w-[768px] lg:w-[1024px]">
      <Link
        to="/museum"
        className="flex transition transform duration-200 pb-4 items-center"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-3xl">Back to museum</div>
      </Link>
      <div className="flex flex-col md:flex-row mt-8">
        <div className="flex-shrink-0 aspect-square md:w-1/2 md:h-1/2 bg-gray-500 border-2 mb-4">
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
        <div className="md:px-4">
          <h1 className="text-4xl pb-1">{painting.title}</h1>
          <div className="pb-2">
            <span>"{painting.savedQuote}"</span>
          </div>
          <div>
            <span className="font-bold">Made by: {painting.author}</span>
          </div>
          <div>
            <span>{painting.authorNotes}</span>
          </div>
          <div className="flex items-center pt-2 gap-2">
            <button
              onClick={() => onLikePainting("currentUser")}
              className="text-4xl hover:scale-110 transition transform duration-200"
            >
              <img src="/assets/heart.png" className="w-10 h-10"></img>
            </button>
            <span className=" flex items-center text-0.5xl">10</span>
          </div>
          <div>
            <span className="font-bold">Comments</span>
            <div className="pt-2 pb-3">
              <textarea
                type="text"
                placeholder="Leave your comment"
                className="border border-black rounded-md px-2 pt-1"
              ></textarea>
            </div>

            <div>
              <span className="pb-3">Painter 123: This is super awesome!</span>
            </div>
            <div>
              <span className="pb-3">Painter 123: This is super awesome!</span>
            </div>
            <div>
              <span className="pb-3">Painter 123: This is super awesome!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
