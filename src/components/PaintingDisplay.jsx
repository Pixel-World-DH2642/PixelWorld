import React from "react";

export function PaintingDisplay({ painting }) {
  const EXPECTED_GRID_SIZE = 16;
  const TOTAL_CELLS = EXPECTED_GRID_SIZE * EXPECTED_GRID_SIZE;
  const FILL_COLOR = "#000000"; // Changed from light gray to black

  if (!painting || !painting.colorMatrix) {
    return (
      <div className="aspect-square border-4 border-black bg-gray-200 flex items-center justify-center">
        <span>No painting data</span>
      </div>
    );
  }

  if (
    Array.isArray(painting.colorMatrix) &&
    !Array.isArray(painting.colorMatrix[0])
  ) {
    const colors = [...painting.colorMatrix];

    // Check if we have incomplete data
    if (colors.length < TOTAL_CELLS) {
      console.warn(
        `Incomplete color matrix for painting "${painting.title}". Expected ${TOTAL_CELLS}, got ${colors.length}.`,
      );

      // Fill remaining cells with black
      const remainingCells = TOTAL_CELLS - colors.length;
      colors.push(...Array(remainingCells).fill(FILL_COLOR));
    } else if (colors.length > TOTAL_CELLS) {
      console.warn(
        `Oversized color matrix for painting "${painting.title}". Expected ${TOTAL_CELLS}, got ${colors.length}.`,
      );
      // Trim excess colors
      colors.length = TOTAL_CELLS;
    }

    return (
      <div
        className="aspect-square border-4 border-black overflow-hidden grid flex-shrink-0" // Make this the grid container
        style={{
          gridTemplateColumns: `repeat(${EXPECTED_GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${EXPECTED_GRID_SIZE}, 1fr)`,
        }}
      >
        {colors.map((color, index) => (
          <div
            key={index}
            style={{ backgroundColor: color }}
            className="w-full h-full"
            title={index >= painting.colorMatrix.length ? "Placeholder" : ""}
          />
        ))}
      </div>
    );
  }

  // Fallback for unexpected formats
  return (
    <div className="aspect-square border-4 border-black mb-1 bg-gray-200 flex items-center justify-center">
      <span>Unsupported painting format</span>
    </div>
  );
}
