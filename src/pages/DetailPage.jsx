export function DetailPage({ painting, onLikePainting, onDislikePainting }) {
  return (
    <div className="font-pixel">
      <div>
        <a href="#" class="hover:underline">
          Back to gallery
        </a>
      </div>
      <div className="flex space-x-4">
        <div className="w-100 h-100 bg-blue-500 rounded-md shadow-md p-4"></div>
        <div className="bg-blue-300 p-4">
          <h1>Title</h1>
          <h3>quote</h3>
          <h2>description</h2>
          <div>
            <button /*onClick={}*/
              className="text-4xl hover:scale-110 transition transform duration-200"
            >
              ❤️
            </button>
            <span>likes</span>
          </div>
          <div>
            <textarea
              type="text"
              placeholder="Leave your comment"
              className="w-full border border-black rounded-md"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
