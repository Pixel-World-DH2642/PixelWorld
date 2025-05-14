import { Link, Navigate } from "react-router-dom";
import { PaintingDisplay } from "../components/PaintingDisplay";
import { useNavigate } from "react-router-dom";

export function DetailPage({
  painting,
  onLikePainting,
  onDislikePainting,
  isLoading,
  error,
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center font-pixel">
        <div className="text-2xl">Loading painting details...</div>
      </div>
    );
  }

  if (!isLoading && !painting) {
    return <Navigate to="/museum" replace />;
  }

  return (
    <section className="font-pixel mx-auto w-full max-h-[calc(100vh-8rem)]">
      <button
        onClick={() => navigate(-1)}
        className="flex transition transform duration-200 items-center cursor-pointer"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-xl sm:text-3xl">
          Back
        </div>
      </button>
      <div className="flex flex-col md:flex-row gap-8 mt-4">
        <div className="aspect-square w-full md:w-1/2 min-w-[250px] shrink-0">
          <PaintingDisplay painting={painting} />
        </div>
        <div className="overflow-y-auto w-full md:w-1/2 md:aspect-square flex flex-col pb-8">
          <div className="w-full h-full">
            <h1 className="text-xl sm:text-3xl pb-1">{painting.title}</h1>
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
                className="text-xl sm:text-3xl hover:scale-110 transition transform duration-200"
              >
                <img src="/assets/heart.png" className="w-10 h-10"></img>
              </button>
              <span className="flex items-center text-0.5xl">10</span>
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
                <span className="pb-3">
                  Painter 123: This is super awesome!
                </span>
              </div>
              <div>
                <span className="pb-3">
                  Painter 123: This is super awesome!
                </span>
              </div>
              <div>
                <span className="">Painter 123: This is super awesome!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
