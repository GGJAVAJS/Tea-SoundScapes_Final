import React, { useEffect, useRef } from 'react';
import { getAnalyser } from '../../lib/audioEngine';

interface Props {
  soundId: string;
}

export const MathematicalVisualizer: React.FC<Props> = ({ soundId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const analyser = getAnalyser(soundId);
    if (!analyser) {
      // If analyser isn't ready yet, maybe we retry or just wait?
      // Since playUrlSound sets it synchronously if buffer is ready, 
      // it might not be ready if it's still fetching.
      // But it's usually ready.
    }

    const dataArray = new Uint8Array(analyser ? analyser.frequencyBinCount : 128);
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback or retry
        const lateAnalyser = getAnalyser(soundId);
        if (lateAnalyser) {
          lateAnalyser.getByteFrequencyData(dataArray);
        }
      }

      ctx.fillStyle = 'rgba(6, 11, 19, 0.2)'; // fade effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.3;

      ctx.save();
      ctx.translate(centerX, centerY);
      
      time += 0.01;
      
      ctx.beginPath();
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const angle = (i / dataArray.length) * Math.PI * 2;
        
        // Mathematical modulation
        const r = radius + (percent * radius * 1.5) * Math.sin(angle * 4 + time);
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${(time * 50) % 360}, 80%, 60%, 0.8)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer rings
      ctx.beginPath();
      for (let i = 0; i < dataArray.length; i++) {
        const value = dataArray[i];
        const percent = value / 255;
        const angle = (i / dataArray.length) * Math.PI * 2;
        
        const r = radius * 1.5 + (percent * radius * 0.5) * Math.cos(angle * 8 - time * 2);
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      
      ctx.strokeStyle = `hsla(${((time * 50) + 180) % 360}, 80%, 60%, 0.4)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [soundId]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
