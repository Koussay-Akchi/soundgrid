import React, { useCallback, useMemo } from "react";
import Box from "./Box";

interface GridProps {
  enabledBoxes: Set<string>;
  setEnabledBoxes: React.Dispatch<React.SetStateAction<Set<string>>>;
  linePosition: number;
  onUserInteraction?: () => void;
}

const Grid: React.FC<GridProps> = ({
  enabledBoxes,
  setEnabledBoxes,
  linePosition,
  onUserInteraction,
}) => {
  const toggleBox = useCallback((row: number, col: number) => {
    setEnabledBoxes((prevEnabledBoxes) => {
      const boxKey = `${row}-${col}`;
      const newEnabledBoxes = new Set(prevEnabledBoxes);
      
      if (newEnabledBoxes.has(boxKey)) {
        newEnabledBoxes.delete(boxKey);
      } else {
        newEnabledBoxes.add(boxKey);
      }
      
      return newEnabledBoxes;
    });
    
    onUserInteraction?.();
  }, [setEnabledBoxes, onUserInteraction]);

  const isEnabled = useCallback((row: number, col: number) =>
    enabledBoxes.has(`${row}-${col}`), [enabledBoxes]);

  const gridCells = useMemo(() => {
    const cells = [];
    for (let rowIndex = 0; rowIndex < 16; rowIndex++) {
      for (let colIndex = 0; colIndex < 10; colIndex++) {
        const key = `${rowIndex}-${colIndex}`;
        cells.push(
          <Box
            key={key}
            isEnabled={isEnabled(rowIndex, colIndex)}
            isLineOver={rowIndex === linePosition}
            rowIndex={rowIndex}
            colIndex={colIndex}
            toggleBox={toggleBox}
          />
        );
      }
    }
    return cells;
  }, [isEnabled, linePosition, toggleBox]);

  return (
    <div className="grid grid-cols-10 gap-1">
      {gridCells}
    </div>
  );
};

export default React.memo(Grid);
