import { Link } from "react-router-dom";
import { painting } from "../DetailMockData";

export function DetailPage({ painting, onLikePainting, onDislikePainting }) {
  if (!painting) {
    return <div className="p-6 text-xl">Loading painting details...</div>;
  }
  return (
    <section className="font-pixel p-6 mx-auto w-full max-w-[512px] md:max-w-[768px] lg:max-w-[1024px]">
      <Link
        to="/museum"
        className="flex transition transform duration-200 pb-4 items-center"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-3xl">Back to museum</div>
      </Link>
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="aspect-square w-full bg-gray-500 border-2">
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
        <div className="">
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
          <div className="">
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
                className="border border-black rounded-md px-2 pt-1 w-full"
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
    </section>
  );
}
