import React, { useMemo } from "react";

interface BoxProps {
  isEnabled: boolean;
  linePosition: number;
  rowIndex: number;
  toggleBox: () => void;
}

const Box: React.FC<BoxProps> = ({
  isEnabled,
  toggleBox,
  linePosition,
  rowIndex,
}) => {
  const className = useMemo(() => {
    const baseClasses = "h-8 w-8 transition-all duration-200 z-30 rounded-md";
    
    if (!isEnabled) {
      return `${baseClasses} bg-gray-800`;
    }
    
    if (rowIndex === linePosition) {
      return `${baseClasses} bg-gray-800`;
    }
    
    return `${baseClasses} bg-white shadow-sm shadow-white`;
  }, [isEnabled, rowIndex, linePosition]);

  return (
    <div
      onClick={toggleBox}
      className={className}
    />
  );
};

export default React.memo(Box);