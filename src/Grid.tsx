import React from "react";
import Box from "./Box";

interface GridProps {
  enabledBoxes: Set<string>;
  setEnabledBoxes: React.Dispatch<React.SetStateAction<Set<string>>>;
  linePosition: number;
}

const Grid: React.FC<GridProps> = ({
  enabledBoxes,
  setEnabledBoxes,
  linePosition,
}) => {
  const toggleBox = (row: number, col: number) => {
    setEnabledBoxes((prevEnabledBoxes) => {
      const newEnabledBoxes = new Set(prevEnabledBoxes);
      const boxKey = `${row}-${col}`;
      if (newEnabledBoxes.has(boxKey)) {
        newEnabledBoxes.delete(boxKey);
      } else {
        newEnabledBoxes.add(boxKey);
      }
      return newEnabledBoxes;
    });
  };

  const isEnabled = (row: number, col: number) =>
    enabledBoxes.has(`${row}-${col}`);

  return (
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: 16 }, (_, rowIndex) =>
        Array.from({ length: 10 }, (_, colIndex) => (
          <Box
            key={`${rowIndex}-${colIndex}`}
            isEnabled={isEnabled(rowIndex, colIndex)}
            rowIndex={rowIndex}
            linePosition={linePosition}
            toggleBox={() => toggleBox(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default React.memo(Grid);
