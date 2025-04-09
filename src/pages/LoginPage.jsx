export function LoginPage({ onLogin, onLoginWithGoogle, onSignup }) {
  return (
    <div
      className="font-pixel min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/assets/bg.jpg')" }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center flex justify-between items-center w-full">
          <div className="text-left">Log in to Pixelworld</div>
          <span className="inline-block ml-2">🖌️</span>
        </h1>
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Email Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-500 text-white rounded-md py-2 hover:bg-gray-600 border-1 border-gray-800"
          >
            Log in
          </button>
        </form>

        <div className="my-4 text-center">
          <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 hover:bg-gray-100">
            <i class="bi bi-google pr-2"></i>
            Continue with Google
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm mb-2 text-left">Are you new here?</p>
          <button className="w-full bg-gray-500 text-white rounded-md py-2 hover:bg-gray-700 border-1 border-gray-800">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
