import { Button } from "@mui/material";

export function QuoteBoard({
  quote,
  includeQuote,
  onGetNewQuote,
  onSaveQuote,
}) {
  const handleSaveQuote = (event) => {
    const isChecked = event.target.checked;
    onSaveQuote(isChecked);
  };

  return (
    <div className="flex flex-col h-full w-full items-center gap-4 p-4 bg-gray-300">
      <h1 className="sm:text-xl">Quote Board</h1>
      {/* TODO: Add a placeholder loading item */}
      {quote.content && (
        <>
          <div className="flex flex-col items-start justify-center gap-2 rounded-md bg-gray-100 p-2">
            <p className="text-sm sm:text-lg text-start">{quote.content}</p>
            <p className="text-xs sm:text-sm italic text-end self-end">
              - {quote.author || "Unknown"}
            </p>
          </div>
          <div className="mb-4">
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
      <div className="mt-auto">
        <Button variant="contained" onClick={onGetNewQuote}>
          Get a new quote
        </Button>
        <p className="text-sm mt-1">Quotes left for today: 1</p>
      </div>
    </div>
  );
}
