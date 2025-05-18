import { useEffect, useState } from "react";
import { Button, TextField, CircularProgress } from "@mui/material";
import { PaintingDisplay } from "./PaintingDisplay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function SubmitModal({
  painting,
  user,
  onSubmitPainting,
  isOpen,
  onClose,
  paintingSubmission,
}) {
  const [includeQuote, setIncludeQuote] = useState(true);
  const [notes, setNotes] = useState("");
  const [title, setTitle] = useState(painting?.title || "");
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    setError(null);
    setIsSuccess(false);
    setIncludeQuote(true);
  }, [isOpen, painting]);
  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Reset any previous errors
    setError(null);

    try {
      // Validate painting data
      if (!painting) {
        setError("No painting data available");
        return;
      }

      // Check if colorMatrix exists and is an array
      if (!painting.colorMatrix || !Array.isArray(painting.colorMatrix)) {
        setError("Invalid painting data: color matrix is missing");
        return;
      }

      if (painting.colorMatrix.length !== 16 * 16) {
        setError(
          `Invalid color matrix: expected 256 elements, got ${painting.colorMatrix.length}`,
        );
        return;
      }

      // Check for required fields
      if (!title.trim()) {
        setError("Title is required");
        return;
      }

      if (!user) {
        setError("User is not authenticated");
        return;
      }

      if (!user.displayName) {
        setError("Author name is required");
        return;
      }

      // Prepare the painting object for submission
      const submissionData = {
        title: title.trim(),
        colorMatrix: painting.colorMatrix,
        authorName: user.displayName,
        userId: user.uid,
        date: Date.now(),
        notes: notes || "",
      };

      // Add quote if included
      if (includeQuote && painting.savedQuote && painting.savedQuote) {
        submissionData.savedQuote = painting.savedQuote;
      }

      // Submit the painting if validation passes
      await onSubmitPainting(submissionData);
      if (!paintingSubmission.error) {
        setIsSuccess(true);
        // reset the form fields
        setTitle("");
        setNotes("");
        setIncludeQuote(true);

        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error submitting painting:", err);
      setError("Failed to submit painting. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-4 border-gray-800 max-h-[90vh] overflow-y-auto relative">
        {/* Loading overlay */}
        {paintingSubmission.loading && !isSuccess && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
            <CircularProgress size={60} />
            <p className="mt-4 text-lg font-semibold">
              Submitting your masterpiece...
            </p>
          </div>
        )}

        {/* Success overlay */}
        {isSuccess && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10">
            <CheckCircleIcon style={{ fontSize: 60, color: "green" }} />
            <p className="mt-4 text-xl font-semibold text-green-700">
              Success!
            </p>
            <p className="text-gray-700">
              Your painting has been submitted to the museum.
            </p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Submit Your Painting</h2>

        <div className="mb-4">
          <PaintingDisplay painting={painting} />
        </div>

        {/* Display validation error if any */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded border border-red-300">
            {error}
          </div>
        )}

        {/* Painting Title Input */}
        <div className="mb-4">
          <TextField
            label="Painting Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your masterpiece"
            error={error && error.includes("Title")}
            className="mb-2"
            disabled={paintingSubmission.loading || isSuccess}
          />
        </div>

        {painting.savedQuote?.content && (
          <div className="mb-4">
            <p className="mb-2 font-semibold">Inspired by quote:</p>
            <p className="mb-2 italic bg-gray-100 p-2 rounded">
              {painting.savedQuote.content}
            </p>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeQuote}
                onChange={(e) => setIncludeQuote(e.target.checked)}
                className="mr-2 h-4 w-4"
                disabled={paintingSubmission.loading || isSuccess}
              />
              <span className="text-sm">Include quote with submission</span>
            </label>
          </div>
        )}

        <div className="mb-4">
          <TextField
            label="Notes about this painting"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your inspiration, technique, or story behind this artwork..."
            className="mb-2"
            disabled={paintingSubmission.loading || isSuccess}
          />
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
            disabled={paintingSubmission.loading || isSuccess}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            disabled={paintingSubmission.loading || isSuccess}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
