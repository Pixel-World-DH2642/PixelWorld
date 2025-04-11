export function ProfilePage({ user, onChangeDisplayName }) {
  return (
    <div className="font-pixel p-6 mx-auto w-[588px] sm:w-[588px] md:w-[784px] lg:max-w-screen-lg">
      {/* Back Arrow */}
      <div className="mb-4">
        <button className="text-2xl">&larr;</button>
      </div>

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
      <hr className="border-t-2 border-black mb-8" />
      <div className="grid grid-cols-3 md:grid-cols-4 gap-8">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className="text-left w-40">
            <div className="w-full aspect-square bg-gray-300 border-4 border-black mb-2" />
            <div className="text-sm">Title</div>
          </div>
        ))}
      </div>
    </div>
  );
}
