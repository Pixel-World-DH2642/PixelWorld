import { Button } from "@mui/material";

export function QuoteBoard({ quote, onGetNewQuote }) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-between gap-4 p-4 bg-gray-300">
      <h1 className="sm:text-xl">Quote Board</h1>
      {/* TODO: Add a placeholder loading item */}
      {quote.content && (
        <div className="flex flex-col items-start justify-center gap-2 rounded-md bg-gray-100 p-2">
          <p className="text-sm sm:text-lg text-start">{quote.content}</p>
          <p className="text-xs sm:text-sm italic text-end self-end">
            - {quote.author || "Unknown"}
          </p>
        </div>
      )}
      <div>
        <Button variant="contained" onClick={onGetNewQuote}>
          Get a new quote
        </Button>
        <p className="text-sm mt-1">Quotes left for today: 1</p>
      </div>
    </div>
  );
}
