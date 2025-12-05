import React, { useEffect, useRef } from "react";

const VoiceVisualizer = ({ isMicOn }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    if (!canvas || !analyser || !dataArray) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const canvasCtx = canvas.getContext("2d");
    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const dotRadius = 25 * 0.8;

    animationFrameRef.current = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const averageVolume = sum / dataArray.length;

    const minRadius = 25;
    const maxRadius = Math.min(width, height) * 0.55;
    const quietThreshold = 15;
    const maxVolumeRange = 255 - quietThreshold;
    const volumeFactor = Math.min(
      255,
      Math.max(0, averageVolume - quietThreshold)
    );
    const responsiveRadius =
      minRadius +
      (volumeFactor / maxVolumeRange) * (maxRadius - minRadius);

    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.fillStyle = "#0d0d0d";
    canvasCtx.fillRect(0, 0, width, height);

    const baseRadius = dotRadius * 1.5;
    const maxRippleRadius = Math.min(width, height) * 0.55;
    const rippleCount = 3;

    for (let i = 0; i < rippleCount; i++) {
      const rippleFactor =
        (responsiveRadius - baseRadius) / (maxRippleRadius - baseRadius);
      const currentRadius =
        baseRadius +
        rippleFactor *
          (maxRippleRadius - baseRadius) *
          (0.3 + i * 0.3);

      const opacity = Math.max(
        0,
        0.7 - (currentRadius / maxRippleRadius) * (0.6 - i * 0.1)
      );

      canvasCtx.beginPath();
      canvasCtx.arc(centerX, centerY, currentRadius, 0, 2 * Math.PI);
      canvasCtx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
      canvasCtx.lineWidth = 3;
      canvasCtx.stroke();
    }

    // central green dot
    canvasCtx.beginPath();
    canvasCtx.arc(centerX, centerY, dotRadius, 0, 2 * Math.PI);
    canvasCtx.fillStyle = "#10B981";
    canvasCtx.fill();

    // mic icon
    const iconColor = "#FFFFFF";
    const micWidth = dotRadius * 0.5;
    const micHeadHeight = dotRadius * 0.5;
    const micStemLength = dotRadius * 0.3;

    canvasCtx.fillStyle = iconColor;

    // mic head
    canvasCtx.beginPath();
    canvasCtx.rect(
      centerX - micWidth / 2,
      centerY - dotRadius * 0.4,
      micWidth,
      micHeadHeight
    );
    canvasCtx.fill();

    // mic stem
    canvasCtx.fillRect(
      centerX - micWidth / 5,
      centerY + dotRadius * 0.1,
      micWidth / 2.5,
      micStemLength
    );
  };

  useEffect(() => {
    const setupAudio = async () => {
      if (!isMicOn) {
        // stop everything if mic is off
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (audioContextRef.current) {
          try {
            await audioContextRef.current.close();
          } catch (e) {
            console.error("Error closing AudioContext:", e);
          }
          audioContextRef.current = null;
        }
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#0d0d0d";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      // mic ON
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.error("Web Audio API is not supported in this browser.");
        return;
      }

      audioContextRef.current = new AudioCtx();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = audioContextRef.current;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        draw();
      } catch (err) {
        console.error("Error getting microphone access: ", err);
      }
    };

    setupAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current
          .close()
          .catch((e) => console.error("Error closing AudioContext:", e));
        audioContextRef.current = null;
      }
    };
  }, [isMicOn]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default VoiceVisualizer;
