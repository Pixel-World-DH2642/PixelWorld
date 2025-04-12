import { Link } from "react-router-dom";

export function DetailPage({ painting, onLikePainting, onDislikePainting }) {
  return (
    <div className="font-pixel p-8">
      <Link
        to="/museum"
        className="flex transition transform duration-200 pb-4 items-center"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-3xl">Back to museum</div>
      </Link>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0 aspect-[4/3] w-full md:w-1/2 bg-gray-500 rounded-md shadow-md border p-4"></div>
        <div className="bg-300 p-4 w-full">
          <h1 className="text-4xl pb-1">Title</h1>
          <div className="pb-2">
            <span>"Everything you can imagine is real" - Pablo Picasso.</span>
          </div>
          <div>
            <span className="font-bold">Owner:</span>
          </div>
          <div>
            <span> This painting is showing a dog.</span>
          </div>
          <div className="flex items-center pt-2 gap-2">
            <button /*onClick={}*/
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
                className="w-full border border-black rounded-md px-2 pt-1"
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
