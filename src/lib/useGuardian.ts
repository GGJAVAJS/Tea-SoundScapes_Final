import { useState, useEffect, useRef } from 'react';

export function useGuardian(active: boolean, onSustainedPeak: () => void, sensitivityOffset: number = 100) {
  const [dbLevel, setDbLevel] = useState(0); // visual baseline
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastStateUpdate = useRef<number>(0);
  const peakFrames = useRef(0);
  
  const callbackRef = useRef(onSustainedPeak);
  const sensitivityRef = useRef(sensitivityOffset);

  useEffect(() => {
    sensitivityRef.current = sensitivityOffset;
  }, [sensitivityOffset]);

  useEffect(() => {
    callbackRef.current = onSustainedPeak;
  }, [onSustainedPeak]);

  useEffect(() => {
    if (!active) {
       setDbLevel(0);
       if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
       }
       if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
       }
       cancelAnimationFrame(rafRef.current);
       return;
    }

    let isCleanup = false;

    async function startListening() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            autoGainControl: false,
            noiseSuppression: false,
            echoCancellation: false
          }, 
          video: false 
        });
        if (isCleanup) {
           stream.getTracks().forEach(t => t.stop());
           return;
        }
        streamRef.current = stream;
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const dataArray = new Float32Array(analyser.fftSize);
        let smoothedRms = 0;

        const update = () => {
          if (isCleanup) return;
          
          analyser.getFloatTimeDomainData(dataArray);
          
          let sumSquares = 0;
          for (let i = 0; i < dataArray.length; i++) {
             sumSquares += dataArray[i] * dataArray[i];
          }
          const rms = Math.sqrt(sumSquares / dataArray.length);
          
          // Exponential moving average for smoothing
          smoothedRms = smoothedRms * 0.95 + rms * 0.05;
          
          // Map RMS to decibels (approximated SPL)
          // 0 dBFS (Full Scale) is rms = 1.
          let currentDb = 0; // base floor
          
          // Noise gate: ignore electronic hum/absolute silence below 0.0005 RMS
          if (smoothedRms > 0.0005) {
            const dbFullScale = 20 * Math.log10(smoothedRms);
            // Offset by -15 so that the default sensitivity of 100 maps a quiet room (-60dBFS) to ~25dB
            // instead of jumping straight to 40dB. Normal speech (-26dBFS) maps perfectly to ~60dB.
            currentDb = Math.round((sensitivityRef.current - 15) + dbFullScale); 
          }
          
          const mappedUserDb = Math.max(0, Math.min(120, currentDb));
          
          // Only update state every ~100ms (10fps) to avoid destroying React rendering performance
          if (Date.now() - lastStateUpdate.current > 100) {
            setDbLevel(prev => {
              // Apply a more aggressive exponential smoothing factor for UI visual
              const diff = mappedUserDb - prev;
              return Math.round(prev + diff * 0.15);
            });
            lastStateUpdate.current = Date.now();
          }

          // Detect sustained peak (e.g., > 65 estimated dB)
          if (mappedUserDb > 65) {
             peakFrames.current++;
             if (peakFrames.current > 60 * 3) { // 3 seconds sustained (approx)
                callbackRef.current();
                peakFrames.current = -120; // 2 second cooldown before checking again
             }
          } else {
             if (peakFrames.current > 0) peakFrames.current -= 2; // quick recovery
             else if (peakFrames.current < 0) peakFrames.current++; // recovering from cooldown
          }

          rafRef.current = requestAnimationFrame(update);
        };
        update();

      } catch (err) {
        console.error("No mic access or permission denied:", err);
      }
    }

    startListening();

    return () => {
      isCleanup = true;
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
      cancelAnimationFrame(rafRef.current);
    }
  }, [active]);

  return dbLevel;
}
