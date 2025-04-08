import { Link } from "react-router-dom";

export function WelcomePage() {
  return (
    <div>
      <h1>Welcome Page</h1>
      <Link to="/login">Login</Link>
      <br />
      <Link to="/world">World</Link>
      <br />
      <Link to="/profile">Profile</Link>
      <br />
      <Link to="/museum">Museum</Link>
      <br />
      <Link to="/details">Detail</Link>
    </div>
  );
}
