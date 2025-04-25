import { Link } from "react-router-dom";

export function Menu(props) {
  return (
    <div>
      <div className="flex items-center justify-center">
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/"
        >
          Back to welcome
        </Link>
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/museum"
        >
          To museum
        </Link>
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/profile"
        >
          To profile
        </Link>
      </div>
    </div>
  );
}
