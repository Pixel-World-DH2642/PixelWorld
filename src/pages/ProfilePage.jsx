import { Link } from "react-router-dom";

export function ProfilePage({ user, onChangeDisplayName }) {
  return (
    <div className="font-pixel p-6 mx-auto w-[512px] md:w-[768px] lg:w-[1024px]">
      {/* Back Arrow */}
      <Link
        to="/world"
        className="flex transition transform duration-200 pb-4 items-center"
      >
        <img src="/assets/back_arrow.png" className="h-8"></img>
        <div className="pl-4 hover:underline flex text-3xl">Back to world</div>
      </Link>

      {/* Profile Info */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-black rounded-full mr-4" />
        <div className="flex items-baseline space-x-2">
          <h1 className="text-3xl font-bold">Painter123</h1>
          <button className="text-sm flex items-center">
            Edit <span className="ml-1">&#9998;</span>
          </button>
        </div>
      </div>

      {/* Gallery */}
      <h1 className="text-4xl font-bold mb-2">Your paintings</h1>
      <div className="border-b-2 border-black mb-8"></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="text-left">
            <div className="aspect-square bg-gray-300 border-4 border-black" />
            <div className="text-sm">Title</div>
          </div>
        ))}
      </div>
    </div>
  );
}
