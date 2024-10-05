import React, { useState } from 'react';

const ROWS = 16;
const COLUMNS = 10;

const Grid: React.FC = () => {
  const [enabledBoxes, setEnabledBoxes] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(COLUMNS).fill(false))
  );

  const toggleBox = (row: number, col: number) => {
    const newEnabledBoxes = [...enabledBoxes];
    newEnabledBoxes[row][col] = !newEnabledBoxes[row][col];
    setEnabledBoxes(newEnabledBoxes);
  };

  return (
    <div className="grid grid-cols-10 gap-1">
      {enabledBoxes.map((row, rowIndex) => (
        row.map((isEnabled, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => toggleBox(rowIndex, colIndex)}
            className={`h-8 w-8 ${isEnabled ? 'bg-white shadow-md' : 'bg-gray-800'} transition-all duration-200`}
          />
        ))
      ))}
    </div>
  );
};

export default Grid;
