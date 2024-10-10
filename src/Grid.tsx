import React from "react";
import Box from "./Box";

interface GridProps {
  enabledBoxes: boolean[][];
  setEnabledBoxes: React.Dispatch<React.SetStateAction<boolean[][]>>;
  linePosition: number;
}

const Grid: React.FC<GridProps> = ({
  enabledBoxes,
  setEnabledBoxes,
  linePosition,
}) => {
  const toggleBox = (row: number, col: number) => {
    const newEnabledBoxes = [...enabledBoxes];
    newEnabledBoxes[row][col] = !newEnabledBoxes[row][col];
    setEnabledBoxes(newEnabledBoxes);
  };

  return (
    <div className="grid grid-cols-10 gap-1">
      {enabledBoxes.map((row, rowIndex) =>
        row.map((isEnabled, colIndex) => (
          <Box
            key={`${rowIndex}-${colIndex}`}
            isEnabled={isEnabled}
            rowIndex={rowIndex}
            linePosition={linePosition}
            toggleBox={() => toggleBox(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
