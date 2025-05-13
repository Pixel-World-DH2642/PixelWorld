import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function LoginPage({ onLogin, onLoginWithGoogle, onSignup }) {
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password, navigate);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password length
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    // Clear errors if validation passes
    setEmailError("");
    setPasswordError("");
    setPasswordMatchError("");

    onSignup(email, password, navigate);
  };

  // Reset errors when inputs change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
    setPasswordMatchError("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatchError("");
  };

  return (
    <div className="">
      {!showSignup ? (
        <>
          <h1 className="text-3xl font-pixel font-bold mb-6 text-center flex justify-between items-center">
            <div className="text-left">Log in to Pixelworld</div>
            <span className="inline-block ml-2">🖌️</span>
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-gray-500 text-white rounded-md py-2 hover:bg-gray-600 border-1 border-gray-800 cursor-pointer"
            >
              Log in
            </button>
          </form>

          <div className="my-4 text-center">
            <button
              onClick={() => {
                onLoginWithGoogle(navigate);
              }}
              className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100 cursor-pointer px-2 whitespace-nowrap"
            >
              <i className="bi bi-google pr-2"></i>
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm mb-2 text-left">Are you new here?</p>
            <button
              onClick={() => setShowSignup(true)}
              className="w-full bg-gray-500 text-white rounded-md py-2 hover:bg-gray-700 border-1 border-gray-800 cursor-pointer"
            >
              Create an account
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl sm:text-3xl font-bold mb-6 text-center flex justify-between items-center w-full">
            <div className="text-left">Create an account</div>
            <span className="inline-block ml-2">🖌️</span>
          </h1>
          <form className="flex flex-col gap-4" onSubmit={handleSignupSubmit}>
            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                className={`w-full border ${emailError ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Email Address"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">{emailError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                className={`w-full border ${passwordError || passwordMatchError ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                className={`w-full border ${passwordMatchError ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              {passwordMatchError && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordMatchError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-gray-500 text-white rounded-md py-2 hover:bg-gray-600 border-1 border-gray-800 cursor-pointer"
            >
              Sign up
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm mb-2">Already have an account?</p>
            <button
              onClick={() => setShowSignup(false)}
              className="w-full bg-gray-500 text-white rounded-md py-2 hover:bg-gray-700 border-1 border-gray-800 cursor-pointer"
            >
              Back to login
            </button>
          </div>
        </>
      )}
    </div>
  );
}
