import React, { useEffect, useRef } from "react";

const VoiceVisualizer = () => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    // Check if the browser supports the Web Audio API
    if (
      typeof window.AudioContext !== "undefined" ||
      typeof window.webkitAudioContext !== "undefined"
    ) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    } else {
      console.error("Web Audio API is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = audioContextRef.current;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContext.createMediaStreamSource(stream);

        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        draw();
      })
      .catch((err) => {
        console.error("Error getting microphone access: ", err);
      });

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasCtx = canvas.getContext("2d");
    const { width, height } = canvas;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    animationFrameRef.current = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = "#0d0d0d"; // Use a dark background color to match the card
    canvasCtx.fillRect(0, 0, width, height);

    const barWidth = (width / dataArray.length) * 2;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = dataArray[i] / 2;

      // Use blue color
      canvasCtx.fillStyle = "#3B82F6";
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  return <canvas ref={canvasRef} className="w-full h-full"></canvas>;
};

export default VoiceVisualizer;
