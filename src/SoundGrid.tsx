import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import "./index.css";
import Grid from "./Grid";
import {
  GiXylophone,
  GiPianoKeys,
  GiBanjo,
  GiMusicalKeyboard,
} from "react-icons/gi";
import Soundfont from "soundfont-player";
import { FaGuitar } from "react-icons/fa";
import { TbTriangleOff } from "react-icons/tb";
import { MdKeyboardArrowDown } from "react-icons/md";

const ROWS = 16;
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"];
// gap needs to be counted here :'(
const BOX_HEIGHT = 2.25;

const instruments = [
  { name: "acoustic_grand_piano", icon: GiPianoKeys },
  { name: "acoustic_guitar_nylon", icon: FaGuitar },
  { name: "kalimba", icon: GiXylophone },
  { name: "tinkle_bell", icon: TbTriangleOff },
  { name: "lead_1_square", icon: GiMusicalKeyboard },
  { name: "banjo", icon: GiBanjo },
];

const SoundGrid = forwardRef((_, ref) => {
  const [linePosition, setLinePosition] = useState(0);
  const [enabledBoxes, setEnabledBoxes] = useState<Set<string>>(new Set());
  const [selectedInstrument, setSelectedInstrument] = useState(
    "acoustic_grand_piano"
  );

  const instrumentRef = useRef<Soundfont.Player | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playersCacheRef = useRef<Map<string, Soundfont.Player>>(new Map());
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    const w = window as unknown as {
      AudioContext: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const AudioCtx = w.AudioContext || w.webkitAudioContext!;
    audioContextRef.current = new AudioCtx();
    
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const ensureAudioContextRunning = useCallback(async () => {
    if (!audioContextRef.current) return false;
    
    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
        setIsAudioReady(true);
        return true;
      } catch (error) {
        console.error("Failed to resume AudioContext:", error);
        return false;
      }
    }
    
    if (audioContextRef.current.state === "running") {
      setIsAudioReady(true);
      return true;
    }
    
    return false;
  }, []);

  const createPlayer = useCallback(async (instrumentName: string) => {
    if (!audioContextRef.current) return null;
    const ac = audioContextRef.current;
    
    try {
      const localPlayer = await Soundfont.instrument(
        ac,
        instrumentName as Soundfont.InstrumentName,
        {
          nameToUrl: (name: string, soundfont: string = "MusyngKite", format: string = "mp3") => {
            const url = `/soundfonts/${soundfont}/${name}-${format}.js`;
            return url;
          },
        }
      );
      return localPlayer;
    } catch (error) {
      console.warn(`Local soundfont not found for ${instrumentName}, falling back to CDN:`, error);
    }

    try {
      const remotePlayer = await Soundfont.instrument(
        ac,
        instrumentName as Soundfont.InstrumentName,
        {
          soundfont: "MusyngKite",
        }
      );
      return remotePlayer;
    } catch (error) {
      console.error(`Failed to load soundfont ${instrumentName}:`, error);
      return null;
    }
  }, []);

  const loadInstrument = useCallback(async (instrumentName: string) => {
    if (!audioContextRef.current) return;
    
    const audioReady = await ensureAudioContextRunning();
    if (!audioReady) {
      return;
    }
    
    const cached = playersCacheRef.current.get(instrumentName);
    if (cached) {
      instrumentRef.current = cached;
      return;
    }
    
    const player = await createPlayer(instrumentName);
    if (player) {
      playersCacheRef.current.set(instrumentName, player);
      instrumentRef.current = player;
    }
  }, [ensureAudioContextRunning, createPlayer]);

  useEffect(() => {
    if (isAudioReady) {
      loadInstrument(selectedInstrument);
    }
  }, [selectedInstrument, loadInstrument, isAudioReady]);

  useEffect(() => {
    if (!isAudioReady || !audioContextRef.current) return;
    
    let cancelled = false;
    (async () => {
      for (const inst of instruments) {
        if (playersCacheRef.current.has(inst.name)) continue;
        try {
          const player = await createPlayer(inst.name);
          if (!cancelled && player) {
            playersCacheRef.current.set(inst.name, player);
          }
        } catch (error) {
          console.error(`Failed to preload ${inst.name}:`, error);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [createPlayer, isAudioReady]);

  useImperativeHandle(ref, () => ({
    resetAllBoxes: () => {
      setEnabledBoxes(new Set());
    },
  }));

  const playSoundsForRow = useCallback(
    (rowIndex: number) => {
      const notesToPlay: string[] = [];
      for (let colIndex = 0; colIndex < notes.length; colIndex++) {
        if (enabledBoxes.has(`${rowIndex}-${colIndex}`)) {
          notesToPlay.push(notes[colIndex]);
        }
      }

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
  }, [enabledBoxes, playSoundsForRow]);

  return (
    <div className="bg-gray-900 w-96 pb-3 rounded-lg mt-2">
      <div className="text-white mb-2">
        {linePosition}/{ROWS}
      </div>
      <div className="flex gap-2 mb-2 justify-center mt-1">
        {instruments.map((instrument) => (
          <div key={instrument.name} className="relative">
            {selectedInstrument === instrument.name && (
              <MdKeyboardArrowDown
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white"
                size={20}
              />
            )}
            <instrument.icon
              size={30}
              className={` cursor-pointer ${
                selectedInstrument === instrument.name
                  ? "text-blue-500"
                  : "hover:text-blue-300"
              }`}
              onClick={async () => {
                const audioReady = await ensureAudioContextRunning();
                if (audioReady) {
                  setSelectedInstrument(instrument.name);
                }
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center relative">
        <Grid
          enabledBoxes={enabledBoxes}
          setEnabledBoxes={setEnabledBoxes}
          linePosition={linePosition}
          onUserInteraction={async () => {
            await ensureAudioContextRunning();
          }}
        />
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

