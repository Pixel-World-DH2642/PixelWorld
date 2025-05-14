import { useEffect, useState } from "react";

export function Loader({ onFinish }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const showTime = 3000; // time before fade starts (3s)
    const fadeDuration = 2000; // fade duration (2s)

    const showTimer = setTimeout(() => {
      setFadeOut(true); // start fade
      const fadeTimer = setTimeout(() => {
        onFinish(); // notify parent to hide loader
      }, fadeDuration);
      return () => clearTimeout(fadeTimer);
    }, showTime);

    return () => clearTimeout(showTimer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white 
        transition-opacity duration-[2000ms] ease-in-out 
        ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <img
        src="public\assets\pixelWorld-intro-gif.gif"
        alt="Loading..."
        className="w-80 h-80"
      />
    </div>
  );
}
