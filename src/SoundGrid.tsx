import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./index.css";
import Grid from "./Grid";
import * as Tone from "tone";

const ROWS = 16;

const SoundGrid = forwardRef((_, ref) => {
  const [linePosition, setLinePosition] = useState(0);
  const [enabledBoxes, setEnabledBoxes] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(10).fill(false))
  );

  useImperativeHandle(ref, () => ({
    resetAllBoxes: () => {
      setEnabledBoxes(
        Array.from({ length: ROWS }, () => Array(10).fill(false))
      );
    },
  }));

  useEffect(() => {
    const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];
    const getNoteFromColumn = (colIndex: number) => {
      return notes[colIndex];
    };

    const playSoundForRow = (rowIndex: number) => {
      const synth = new Tone.Synth().toDestination();
      enabledBoxes[rowIndex].forEach((isEnabled, colIndex) => {
        if (isEnabled) {
          const note = getNoteFromColumn(colIndex); // Get note from column index
          synth.triggerAttackRelease(note, "8n");
        }
      });
    };

    const interval = setInterval(() => {
      setLinePosition((prev) => {
        const newPosition = (prev + 1) % ROWS;
        playSoundForRow(newPosition);
        return newPosition;
      });
    }, 2000 / ROWS);
    return () => clearInterval(interval);
  }, [enabledBoxes]);

  return (
    <div className="flex items-center justify-center bg-gray-900 w-96 relative">
      <Grid enabledBoxes={enabledBoxes} setEnabledBoxes={setEnabledBoxes} />
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
});

export default SoundGrid;
