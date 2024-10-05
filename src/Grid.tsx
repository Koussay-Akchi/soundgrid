import React, { useState } from 'react';
import Box from './Box';

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
          <Box
            key={`${rowIndex}-${colIndex}`}
            isEnabled={isEnabled}
            toggleBox={() => toggleBox(rowIndex, colIndex)}
          />
        ))
      ))}
    </div>
  );
};

export default Grid;
