import { Link } from "react-router-dom";

export function WelcomePage() {
  return (
    <div>
      <h1>Welcome Page</h1>
      <div className="flex items-center justify-start">
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/login"
        >
          Login
        </Link>
        <br />
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/world"
        >
          World
        </Link>
        <br />
        <Link
          className="m-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          to="/profile"
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
