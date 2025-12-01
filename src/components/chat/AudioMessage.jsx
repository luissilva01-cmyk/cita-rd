import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function AudioMessage({ audioUrl, mine }) {
  const waveformRef = useRef(null);
  const waveSurfer = useRef(null);
  const mineRef = useRef(mine);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    waveSurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: mineRef.current ? "#ffffffaa" : "#777",
      progressColor: mineRef.current ? "#ffffff" : "#000",
      barWidth: 2,
      barGap: 2,
      height: 30,
      cursorWidth: 0,
      responsive: true
    });

    waveSurfer.current.load(audioUrl);
    waveSurfer.current.on("finish", () => setIsPlaying(false));

    return () => waveSurfer.current.destroy();
  }, [audioUrl]);

  const togglePlay = () => {
    if (!waveSurfer.current) return;
    waveSurfer.current.playPause();
    setIsPlaying(waveSurfer.current.isPlaying());
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={togglePlay}
        className={`p-2 rounded-full text-white ${
          mine ? "bg-orange-500" : "bg-gray-800"
        }`}
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <div ref={waveformRef} className="w-[140px]"></div>
    </div>
  );
}
