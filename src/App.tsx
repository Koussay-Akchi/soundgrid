import { useRef } from "react";
import "./App.css";
import SoundGrid from "./SoundGrid";
import ReplayIcon from "@mui/icons-material/Replay";

function App() {
  const soundGridRef = useRef<{ resetAllBoxes: () => void } | null>(null);

  const handleReset = () => {
    soundGridRef.current?.resetAllBoxes();
  };
  return (
    <div className=" overflow-hidden">
      <SoundGrid ref={soundGridRef} />
      <div className="flex gap-2 justify-center">
        <h1>Sound-Grid</h1>
        <button
          type="button"
          className="w-12 h-12 text-lg mt-2 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors "
          aria-label="Close"
          onClick={handleReset}
        >
          <ReplayIcon />
        </button>
      </div>
    </div>
  );
}

export default App;
