import { useState } from "react";
import { Button } from "@mui/material";
import { PaintingDisplay } from "./PaintingDisplay";

export function SubmitModal({
  quote,
  painting,
  onSubmitPainting,
  isOpen,
  onClose,
}) {
  const [includeQuote, setIncludeQuote] = useState(true);
  const [notes, setNotes] = useState("");
  if (!isOpen) return null;

  const handleSubmit = () => {
    // TODO: prepare the painting object for upload
    onClose();
  };

  console.log("SubmitModal", painting);
  console.log("SubmitModal quote", quote);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-4 border-gray-800 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Submit Your Painting</h2>

        <div className="mb-4">
          <PaintingDisplay painting={painting} />
        </div>
        {quote.content && (
          <div className="mb-4">
            <p className="mb-2 font-semibold">Inspired by quote:</p>
            <p className="mb-2 italic bg-gray-100 p-2 rounded">
              {quote.content}
            </p>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeQuote}
                onChange={(e) => setIncludeQuote(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <span className="text-sm">Include quote with submission</span>
            </label>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Add your notes about this painting:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your inspiration, technique, or story behind this artwork..."
            className="w-full p-2 border border-gray-300 rounded resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">
            Are you sure you want to submit this painting?
          </p>
          <p className="text-sm text-gray-600">
            Once submitted, your painting will be displayed in the museum.
          </p>
        </div>

        <div className="flex justify-end gap-x-4 mt-6">
          <Button
            variant="outlined"
            color="error"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
