import { useState, useEffect, useRef } from 'react';

export function useGuardian(active: boolean, onSustainedPeak: () => void) {
  const [dbLevel, setDbLevel] = useState(0); // visual baseline
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastStateUpdate = useRef<number>(0);
  const peakFrames = useRef(0);

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
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const update = () => {
          if (isCleanup) return;
          analyser.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
             sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          // Map to ~30-100dB for UI visualization
          const mappedUserDb = Math.max(30, Math.round((average / 255) * 80 + 30));
          
          // Only update state every ~100ms (10fps) to avoid destroying React rendering performance for the entire App
          if (Date.now() - lastStateUpdate.current > 100) {
            setDbLevel(prev => {
               const target = mappedUserDb;
               return Math.round(prev + (target - prev) * 0.3);
            });
            lastStateUpdate.current = Date.now();
          }

          // Detect sustained peak (e.g., > 65 estimated dB)
          if (mappedUserDb > 65) {
             peakFrames.current++;
             if (peakFrames.current > 60 * 3) { // 3 seconds sustained
                onSustainedPeak();
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
  }, [active, onSustainedPeak]);

  return dbLevel;
}
