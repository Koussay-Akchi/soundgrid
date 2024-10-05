import React from 'react';

interface BoxProps {
  isEnabled: boolean;
  toggleBox: () => void;
}

const Box: React.FC<BoxProps> = ({ isEnabled, toggleBox }) => {
  return (
    <div
      onClick={toggleBox}
      className={`h-8 w-8 ${isEnabled ? 'bg-white shadow-md' : 'bg-gray-800'} transition-all duration-200`}
    />
  );
};

export default Box;
