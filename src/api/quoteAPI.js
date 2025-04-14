import { PROXY_URL, PROXY_KEY } from "./apiConfig";

export const getRandomQuote = async () => {
  const response = await fetch(PROXY_URL + "https://zenquotes.io/api/random", {
    headers: {
      "X-DH2642-Key": PROXY_KEY,
      "X-DH2642-Group": "77",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch quote");
  }
  const data = await response.json();
  return {
    quote: {
      content: data[0].q,
      author: data[0].a,
    },
    timestamp: Date.now(),
  };
};
