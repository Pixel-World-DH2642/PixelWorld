import { Button } from "@mui/material";
import { useState, useEffect } from "react";

export function QuoteBoard({
  user,
  quote,
  includeQuote,
  onGetNewQuote,
  onSaveQuoteToPainting,
  quotesRemaining,
  quoteStatus,
  quoteError,
}) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Show error when fetch fails
    if (quoteStatus === "failed" && !showError && quoteError) {
      setShowError(true);
    }
  }, [quoteStatus, showError, quoteError]);

  const handleSaveQuote = (event) => {
    const isChecked = event.target.checked;
    onSaveQuoteToPainting(isChecked, quote);
  };

  const handleGetNewQuote = () => {
    setShowError(false);
    onGetNewQuote();
  };

  const isLoading = quoteStatus === "loading" || quoteStatus === "checking";
  const isQuoteLimitReached = quotesRemaining <= 0;

  return (
    <div className="flex flex-col h-full w-full items-center gap-3 p-4 bg-gray-300">
      <h1 className="sm:text-xl">Quote Board</h1>

      {showError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">
            {quoteError || "Failed to fetch quote."}
          </span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4"
            onClick={() => setShowError(false)}
          >
            ×
          </button>
        </div>
      )}

      {!quote?.content ? (
        <>
          <div className="w-full flex flex-col items-start justify-center gap-2 rounded-md bg-gray-100 p-2">
            <p className="text-sm sm:text-lg text-start italic text-gray-500">
              {isLoading
                ? "Loading..."
                : 'Click "Get a new quote" to display an inspiring quote...'}
            </p>
          </div>
          <div className="mb-2">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2 h-4 w-4" disabled={true} />
              <span className="text-sm">Include quote with submission</span>
            </label>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex flex-col items-start justify-center gap-2 rounded-md bg-gray-100 p-2">
            <p className="text-sm sm:text-lg text-start">{quote.content}</p>
            <p className="text-xs sm:text-sm italic text-end self-end">
              - {quote.author || "Unknown"}
            </p>
          </div>
          <div className="mb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeQuote}
                onChange={handleSaveQuote}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm">Include quote with submission</span>
            </label>
          </div>
        </>
      )}

      <div className="mt-2">
        <p className="text-sm mb-1">Quotes left for today: {quotesRemaining}</p>
        {isQuoteLimitReached && (
          <p className="text-sm text-red-500 mb-2">
            You've reached your daily quote limit. Come back tomorrow!
          </p>
        )}
        <Button
          variant="contained"
          onClick={handleGetNewQuote}
          disabled={isQuoteLimitReached || isLoading}
        >
          {isLoading ? "Loading..." : "Get a new quote"}
        </Button>
      </div>
    </div>
  );
}
