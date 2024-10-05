import React, { useState, useEffect } from "react";
import "./index.css";
import Grid from "./Grid";

const ROWS = 16;

const SoundGrid: React.FC = () => {
  const [linePosition, setLinePosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLinePosition((prev) => (prev + 1) % ROWS);
    }, 2000 / ROWS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-900 w-96 relative">
      <Grid linePosition={linePosition} />
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
        style={{
          transform: `translateY(${linePosition * (100 / ROWS)}%)`,
        }}
      >
        <div className="w-full h-4 mt-2 rounded-md bg-[#474956]" />
      </div>
    </div>
  );
};

export default SoundGrid;
