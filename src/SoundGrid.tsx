import { useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef } from "react";
import "./index.css";
import Grid from "./Grid";
import * as Tone from "tone";

const ROWS = 16;
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];

const SoundGrid = forwardRef((_, ref) => {
  const [linePosition, setLinePosition] = useState(0);
  const [enabledBoxes, setEnabledBoxes] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(10).fill(false))
  );
  
  const polySynthRef = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    polySynthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    return () => {
      polySynthRef.current?.dispose();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    resetAllBoxes: () => {
      setEnabledBoxes(
        Array.from({ length: ROWS }, () => Array(10).fill(false))
      );
    },
  }));

  const playSoundsForRow = useCallback((rowIndex: number) => {
    const notesToPlay: string[] = [];
    enabledBoxes[rowIndex].forEach((isEnabled, colIndex) => {
      if (isEnabled) {
        notesToPlay.push(notes[colIndex]);
      }
    });

    if (notesToPlay.length > 0 && polySynthRef.current) {
      polySynthRef.current.triggerAttackRelease(notesToPlay, "8n");
    }
  }, [enabledBoxes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLinePosition((prev) => {
        const newPosition = (prev + 1) % ROWS;
        playSoundsForRow(newPosition);
        return newPosition;
      });
    }, 2000 / ROWS);

    return () => clearInterval(interval);
  }, [playSoundsForRow]);

  return (
    <div>{linePosition}/{ROWS}
    <div className="flex items-center justify-center bg-gray-900 w-96 relative py-3">
      <Grid enabledBoxes={enabledBoxes} setEnabledBoxes={setEnabledBoxes} />
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
        style={{
          transform: `translateY(${linePosition * (100 / ROWS)}%)`,
        }}
      >
        <div className="w-full h-4 mt-3 rounded-md bg-[#474956]" />
      </div>
    </div>
    </div>
  );
});

export default SoundGrid;