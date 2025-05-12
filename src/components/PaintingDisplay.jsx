import React from "react";

export function PaintingDisplay({ painting }) {
  if (!painting || !painting.colorMatrix) {
    return (
      <div className="aspect-square border-4 border-black mb-1 bg-gray-200 flex items-center justify-center">
        <span>No painting data</span>
      </div>
    );
  }

  // Handle flat array of colors (expected to be 8x8=64 colors)
  if (
    Array.isArray(painting.colorMatrix) &&
    !Array.isArray(painting.colorMatrix[0])
  ) {
    const EXPECTED_GRID_SIZE = 8; // 8x8 grid
    const TOTAL_CELLS = EXPECTED_GRID_SIZE * EXPECTED_GRID_SIZE; // 64
    const colors = [...painting.colorMatrix];

    // Check if we have incomplete data
    if (colors.length < TOTAL_CELLS) {
      console.warn(
        `Incomplete color matrix for painting "${painting.title}". Expected ${TOTAL_CELLS}, got ${colors.length}.`,
      );

      // Fill remaining cells with a neutral color
      const remainingCells = TOTAL_CELLS - colors.length;
      const fillColor = "#EEEEEE"; // Light gray as placeholder
      colors.push(...Array(remainingCells).fill(fillColor));
    } else if (colors.length > TOTAL_CELLS) {
      console.warn(
        `Oversized color matrix for painting "${painting.title}". Expected ${TOTAL_CELLS}, got ${colors.length}.`,
      );
      // Trim excess colors
      colors.length = TOTAL_CELLS;
    }

    return (
      <div className="aspect-square border-4 border-black mb-1 overflow-hidden">
        <div
          className="grid w-full h-full"
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
      </div>
    );
  }

  // Handle 2D array (original format - should be 8x8)
  if (
    Array.isArray(painting.colorMatrix) &&
    Array.isArray(painting.colorMatrix[0])
  ) {
    const EXPECTED_GRID_SIZE = 8;
    let adjustedMatrix = [...painting.colorMatrix];

    // Check row count
    if (adjustedMatrix.length < EXPECTED_GRID_SIZE) {
      console.warn(
        `Incomplete row count for painting "${painting.title}". Expected ${EXPECTED_GRID_SIZE}, got ${adjustedMatrix.length}.`,
      );
      // Add missing rows
      const emptyRow = Array(EXPECTED_GRID_SIZE).fill("#EEEEEE");
      while (adjustedMatrix.length < EXPECTED_GRID_SIZE) {
        adjustedMatrix.push([...emptyRow]);
      }
    } else if (adjustedMatrix.length > EXPECTED_GRID_SIZE) {
      // Trim excess rows
      adjustedMatrix = adjustedMatrix.slice(0, EXPECTED_GRID_SIZE);
    }

    // Check column count for each row
    adjustedMatrix = adjustedMatrix.map((row, idx) => {
      if (row.length < EXPECTED_GRID_SIZE) {
        // Add missing cells in this row
        return [
          ...row,
          ...Array(EXPECTED_GRID_SIZE - row.length).fill("#EEEEEE"),
        ];
      } else if (row.length > EXPECTED_GRID_SIZE) {
        // Trim excess cells in this row
        return row.slice(0, EXPECTED_GRID_SIZE);
      }
      return row;
    });

    return (
      <div className="aspect-square border-4 border-black mb-1 overflow-hidden">
        {adjustedMatrix.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex"
            style={{
              height: `${100 / EXPECTED_GRID_SIZE}%`,
            }}
          >
            {row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  backgroundColor: color,
                  width: `${100 / EXPECTED_GRID_SIZE}%`,
                  height: "100%",
                }}
                title={
                  rowIndex >= painting.colorMatrix.length ||
                  colIndex >= painting.colorMatrix[rowIndex]?.length
                    ? "Placeholder"
                    : ""
                }
              />
            ))}
          </div>
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
