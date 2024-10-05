import { useRef } from "react";
import "./App.css";
import SoundGrid from "./SoundGrid";
import ReplayIcon from "@mui/icons-material/Replay";
import Footer from "./Footer";

function App() {
  const soundGridRef = useRef<{ resetAllBoxes: () => void } | null>(null);

  const handleReset = () => {
    soundGridRef.current?.resetAllBoxes();
  };
  return (
    <div className="overflow-hidden">
      <div className="flex justify-center mb-2 gap-6">
        <div className=" flex justify-center">
          <SoundGrid ref={soundGridRef} />
        </div>
        <div className=" mt-auto mb-auto">
          <h1>Sound-Grid</h1>
          <div className="flex gap-2 justify-center">
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
      </div>

      <Footer />
    </div>
  );
}

export default App;
