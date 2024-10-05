import React, { useState, useEffect } from "react";
import Box from "./Box";

const ROWS = 16;
const COLUMNS = 10;

const Grid: React.FC = () => {
  const [enabledBoxes, setEnabledBoxes] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(COLUMNS).fill(false))
  );
  const [linePosition, setLinePosition] = useState(0);

  const toggleBox = (row: number, col: number) => {
    const newEnabledBoxes = [...enabledBoxes];
    newEnabledBoxes[row][col] = !newEnabledBoxes[row][col];
    setEnabledBoxes(newEnabledBoxes);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLinePosition((prev) => (prev + 1) % ROWS);
    }, 2000 / ROWS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative grid grid-cols-10 gap-1 ">
      {enabledBoxes.map((row, rowIndex) =>
        row.map((isEnabled, colIndex) => (
          <Box
            key={`${rowIndex}-${colIndex}`}
            isEnabled={isEnabled}
            toggleBox={() => toggleBox(rowIndex, colIndex)}
          />
        ))
      )}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
        style={{
          transform: `translateY(${linePosition * (100 / ROWS)}%)`,
        }}
      >
        <div className="w-full h-9 bg-[#474956]" />
      </div>
    </div>
  );
};

export default Grid;
