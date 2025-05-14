export function Suspense(state, message) {
  const displayState = state || "loading";
  const displayMessage = message || "Loading...";

  return (
    <div className="flex flex-col justify-center items-center font-pixel p-4 py-32">
      {displayState === "loading" && (
        <>
          <img
            src="/assets/loading.gif"
            alt="Loading animation"
            className="w-20 h-20"
          />
          <div className="text-2xl text-center">{displayMessage}</div>
        </>
      )}
      {displayState === "error" && (
        <div className="text-red-500 text-center">Error: {displayMessage}</div>
      )}
    </div>
  );
}
