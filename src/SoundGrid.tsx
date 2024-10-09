import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
} from "react";
import "./index.css";
import Grid from "./Grid";
import { GiXylophone } from "react-icons/gi";
import { GiPianoKeys } from "react-icons/gi";
import Soundfont from "soundfont-player";
import { FaGuitar } from "react-icons/fa";
import { GiBanjo } from "react-icons/gi";
import { GiMusicalKeyboard } from "react-icons/gi";
import { TbTriangleOff } from "react-icons/tb";
const ROWS = 16;
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];
// gap needs to be counted here :'(
const BOX_HEIGHT = 2.25;

const instruments = [
  "acoustic_grand_piano",
  "acoustic_guitar_nylon",
  "kalimba",
  "glockenspiel",
  "lead_1_square",
  "banjo",
];

const SoundGrid = forwardRef((_, ref) => {
  const [linePosition, setLinePosition] = useState(0);
  const [enabledBoxes, setEnabledBoxes] = useState<boolean[][]>(
    Array.from({ length: ROWS }, () => Array(10).fill(false))
  );
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);

  const instrumentRef = useRef<Soundfont.Player | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.AudioContext)();
    loadInstrument(selectedInstrument);

    return () => {
      audioContextRef.current?.close();
    };
  }, [selectedInstrument]);

  const loadInstrument = async (instrumentName: string) => {
    if (audioContextRef.current) {
      instrumentRef.current = await Soundfont.instrument(
        audioContextRef.current,
        instrumentName as Soundfont.InstrumentName
      );
    }
  };

  useEffect(() => {
    loadInstrument(selectedInstrument);
  }, [selectedInstrument]);

  useImperativeHandle(ref, () => ({
    resetAllBoxes: () => {
      setEnabledBoxes(
        Array.from({ length: ROWS }, () => Array(10).fill(false))
      );
    },
  }));

  const playSoundsForRow = useCallback(
    (rowIndex: number) => {
      const notesToPlay: string[] = [];
      enabledBoxes[rowIndex].forEach((isEnabled, colIndex) => {
        if (isEnabled) {
          notesToPlay.push(notes[colIndex]);
        }
      });

      if (notesToPlay.length > 0 && instrumentRef.current) {
        notesToPlay.forEach((note) =>
          instrumentRef.current
            ?.play(note)
            .stop(audioContextRef.current!.currentTime + 0.2)
        );
      }
    },
    [enabledBoxes]
  );

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
    <div className="bg-gray-900 w-96 pb-3 rounded-lg mt-2">
      <div className="text-white mb-2">
        {linePosition}/{ROWS}
      </div>
      <select
        value={selectedInstrument}
        onChange={(e) => setSelectedInstrument(e.target.value)}
        className="mb-2 p-1 rounded"
      >
        {instruments.map((instrument) => (
          <option key={instrument} value={instrument}>
            {instrument.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <div className=" flex gap-2 mb-2 justify-center">
        <FaGuitar size={30} />
        <GiXylophone size={30} />
        <GiPianoKeys size={30} />
        <GiBanjo size={30} />
        <TbTriangleOff size={30} />
        <GiMusicalKeyboard size={30} />
      </div>
      <div className="flex items-center justify-center relative">
        <Grid enabledBoxes={enabledBoxes} setEnabledBoxes={setEnabledBoxes} />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={{
            transform: `translateY(${linePosition * BOX_HEIGHT}rem)`,
          }}
        >
          <div className="w-full h-8 rounded-md bg-[#474956]" />
        </div>
      </div>
    </div>
  );
});

export default SoundGrid;
