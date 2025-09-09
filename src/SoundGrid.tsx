import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  useMemo,
  memo,
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
const NOTES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"] as const;
const BOX_HEIGHT = 2.25;
const INTERVAL_TIME = 2000 / ROWS;
const NOTE_DURATION = 0.2;

const INSTRUMENTS = [
  { name: "acoustic_grand_piano", icon: GiPianoKeys },
  { name: "acoustic_guitar_nylon", icon: FaGuitar },
  { name: "kalimba", icon: GiXylophone },
  { name: "tinkle_bell", icon: TbTriangleOff },
  { name: "lead_1_square", icon: GiMusicalKeyboard },
  { name: "banjo", icon: GiBanjo },
] as const;

const DEFAULT_INSTRUMENT = "acoustic_grand_piano";

interface InstrumentIconProps {
  instrument: (typeof INSTRUMENTS)[number];
  isSelected: boolean;
  onClick: () => void;
}

const InstrumentIcon = memo<InstrumentIconProps>(({ instrument, isSelected, onClick }) => {
  const IconComponent = instrument.icon;
  
  return (
    <div className="relative">
      {isSelected && (
        <MdKeyboardArrowDown
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-white"
          size={20}
        />
      )}
      <IconComponent
        size={30}
        className={`cursor-pointer ${
          isSelected ? "text-blue-500" : "hover:text-blue-300"
        }`}
        onClick={onClick}
      />
    </div>
  );
});

InstrumentIcon.displayName = 'InstrumentIcon';

const SoundGrid = forwardRef((_, ref) => {
  const [linePosition, setLinePosition] = useState(0);
  const [enabledBoxes, setEnabledBoxes] = useState<Set<string>>(new Set());
  const [selectedInstrument, setSelectedInstrument] = useState(DEFAULT_INSTRUMENT);

  const instrumentRef = useRef<Soundfont.Player | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playersCacheRef = useRef<Map<string, Soundfont.Player>>(new Map());
  const intervalRef = useRef<number | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const audioContext = useMemo(() => {
    const w = window as unknown as {
      AudioContext: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    return w.AudioContext || w.webkitAudioContext!;
  }, []);

  useEffect(() => {
    audioContextRef.current = new audioContext();
    return () => {
      audioContextRef.current?.close();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [audioContext]);

  const ensureAudioContextRunning = useCallback(async () => {
    const ctx = audioContextRef.current;
    if (!ctx) return false;
    
    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
        setIsAudioReady(true);
        return true;
      } catch (error) {
        console.error("Failed to resume AudioContext:", error);
        return false;
      }
    }
    
    if (ctx.state === "running") {
      setIsAudioReady(true);
      return true;
    }
    
    return false;
  }, []);

  const createPlayer = useCallback(async (instrumentName: string) => {
    const ac = audioContextRef.current;
    if (!ac) return null;
    
    const localOptions = {
      nameToUrl: (name: string, soundfont = "MusyngKite", format = "mp3") => 
        `/soundfonts/${soundfont}/${name}-${format}.js`,
    };
    
    try {
      return await Soundfont.instrument(ac, instrumentName as Soundfont.InstrumentName, localOptions);
    } catch (error) {
      console.warn(`Local soundfont not found for ${instrumentName}, falling back to CDN:`, error);
    }

    try {
      return await Soundfont.instrument(ac, instrumentName as Soundfont.InstrumentName, {
        soundfont: "MusyngKite",
      });
    } catch (error) {
      console.error(`Failed to load soundfont ${instrumentName}:`, error);
      return null;
    }
  }, []);

  const loadInstrument = useCallback(async (instrumentName: string) => {
    if (!audioContextRef.current) return;
    
    const audioReady = await ensureAudioContextRunning();
    if (!audioReady) return;
    
    const cache = playersCacheRef.current;
    const cached = cache.get(instrumentName);
    if (cached) {
      instrumentRef.current = cached;
      return;
    }
    
    const player = await createPlayer(instrumentName);
    if (player) {
      cache.set(instrumentName, player);
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
    const cache = playersCacheRef.current;
    
    (async () => {
      for (const inst of INSTRUMENTS) {
        if (cancelled || cache.has(inst.name)) continue;
        try {
          const player = await createPlayer(inst.name);
          if (!cancelled && player) {
            cache.set(inst.name, player);
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

  const resetAllBoxes = useCallback(() => {
    setEnabledBoxes(new Set());
  }, []);

  useImperativeHandle(ref, () => ({
    resetAllBoxes,
  }), [resetAllBoxes]);

  const playSoundsForRow = useCallback(
    (rowIndex: number) => {
      const player = instrumentRef.current;
      const ctx = audioContextRef.current;
      if (!player || !ctx) return;
      
      const notesToPlay: string[] = [];
      const stopTime = ctx.currentTime + NOTE_DURATION;
      
      for (let colIndex = 0; colIndex < NOTES.length; colIndex++) {
        if (enabledBoxes.has(`${rowIndex}-${colIndex}`)) {
          notesToPlay.push(NOTES[colIndex]);
        }
      }

      if (notesToPlay.length > 0) {
        notesToPlay.forEach((note) => player.play(note).stop(stopTime));
      }
    },
    [enabledBoxes]
  );

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setLinePosition((prev) => {
        const newPosition = (prev + 1) % ROWS;
        playSoundsForRow(newPosition);
        return newPosition;
      });
    }, INTERVAL_TIME);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playSoundsForRow]);

  const handleInstrumentClick = useCallback(async (instrumentName: string) => {
    const audioReady = await ensureAudioContextRunning();
    if (audioReady) {
      setSelectedInstrument(instrumentName);
    }
  }, [ensureAudioContextRunning]);

  const handleUserInteraction = useCallback(async () => {
    await ensureAudioContextRunning();
  }, [ensureAudioContextRunning]);

  const progressStyle = useMemo(() => ({
    transform: `translateY(${linePosition * BOX_HEIGHT}rem)`,
  }), [linePosition]);

  return (
    <div className="bg-gray-900 w-96 pb-3 rounded-lg mt-2">
      <div className="text-white mb-2">
        {linePosition}/{ROWS}
      </div>
      <div className="flex gap-2 mb-2 justify-center mt-1">
        {INSTRUMENTS.map((instrument) => (
          <InstrumentIcon
            key={instrument.name}
            instrument={instrument}
            isSelected={selectedInstrument === instrument.name}
            onClick={() => handleInstrumentClick(instrument.name)}
          />
        ))}
      </div>
      <div className="flex items-center justify-center relative">
        <Grid
          enabledBoxes={enabledBoxes}
          setEnabledBoxes={setEnabledBoxes}
          linePosition={linePosition}
          onUserInteraction={handleUserInteraction}
        />
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-20"
          style={progressStyle}
        >
          <div className="w-full h-8 rounded-md bg-[#474956]" />
        </div>
      </div>
    </div>
  );
});

export default SoundGrid;

