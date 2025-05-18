import React from "react";

export function PaintingDisplay({ painting }) {
  const EXPECTED_GRID_SIZE = 16;
  const TOTAL_CELLS = EXPECTED_GRID_SIZE * EXPECTED_GRID_SIZE;
  const FILL_COLOR = "#000000";

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
    let colors = [...painting.colorMatrix];

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

    // Convert flat array back to 2D for easier manipulation
    const matrix2D = [];
    for (let y = 0; y < EXPECTED_GRID_SIZE; y++) {
      matrix2D[y] = [];
      for (let x = 0; x < EXPECTED_GRID_SIZE; x++) {
        matrix2D[y][x] = colors[y * EXPECTED_GRID_SIZE + x];
      }
    }

    // Transpose the matrix to match the canvas orientation
    const transposed = [];
    for (let x = 0; x < EXPECTED_GRID_SIZE; x++) {
      transposed[x] = [];
      for (let y = 0; y < EXPECTED_GRID_SIZE; y++) {
        transposed[x][y] = matrix2D[y][x];
      }
    }

    // Flatten for rendering
    colors = transposed.flat();

    return (
      <div
        className="aspect-square border-4 border-black overflow-hidden grid flex-shrink-0"
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
