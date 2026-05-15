import React, { useMemo } from "react";

interface BoxProps {
  isEnabled: boolean;
  isLineOver: boolean;
  rowIndex: number;
  colIndex: number;
  toggleBox: (row: number, col: number) => void;
}

const Box: React.FC<BoxProps> = ({
  isEnabled,
  isLineOver,
  rowIndex,
  colIndex,
  toggleBox,
}) => {
  const className = useMemo(() => {
    const baseClasses = "h-8 w-8 transition-all duration-200 z-30 rounded-md cursor-pointer";
    
    if (!isEnabled) {
      return `${baseClasses} bg-gray-800`;
    }
    
    if (isLineOver) {
      return `${baseClasses} bg-gray-800`;
    }
    
    return `${baseClasses} bg-white shadow-sm shadow-white`;
  }, [isEnabled, isLineOver]);

  return (
    <div
      onClick={() => toggleBox(rowIndex, colIndex)}
      className={className}
    />
  );
};

export default React.memo(Box);