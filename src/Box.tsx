import React from 'react';

interface BoxProps {
  isEnabled: boolean;
  toggleBox: () => void;
}

const Box: React.FC<BoxProps> = ({ isEnabled, toggleBox }) => {
  return (
    <div
      onClick={toggleBox}
      className={`h-8 w-8 ${isEnabled ? 'bg-white shadow-sm shadow-white ' : 'bg-gray-800'} transition-all duration-200 z-30 rounded-md`}
    />
  );
};

export default Box;
