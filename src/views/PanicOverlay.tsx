import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef, Suspense } from 'react';
import { Check } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Html, useProgress, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Preload the space boi model
useGLTF.preload('/space_boi.glb');

// Simple loading indicator for 3D canvas
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
      </div>
    </Html>
  );
}

function SpaceBoiModel({ phase }: { phase: string }) {
  const group = useRef<THREE.Group>(null);
  const gltf = useGLTF('/space_boi.glb');
  
  // Base scale calculation from phase for full screen canvas
  const targetScale = phase === 'Inspire...' ? 0.6 : phase === 'Expire...' ? 0.35 : 0.6;

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
      
      // Smoothly animate scale
      const currentScale = group.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 2);
      group.current.scale.set(newScale, newScale, newScale);
    }
  });

  return (
    <group ref={group} position={[0, -3.5, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

interface PanicOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | 'animals' | 'magic' | null;
  isSmsSent?: boolean;
}

const DinoPanicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center bg-[#1B2F09]" style={{ perspective: 1000 }}>
      {/* Sun/Light in the center distance */}
      <div className="absolute w-64 h-64 bg-[#fde047] rounded-full blur-[100px] opacity-40 z-0" />
      
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 flex items-center justify-center origin-center pointer-events-none"
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: [0.1, 1, 3], opacity: [0, 1, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * (8 / 5)
          }}
        >
          {/* Layer composition simulating a forest tunnel - drop shadows removed for performance */}
          <img src="/arvore.png" className="absolute top-[10%] left-[5%] w-64" alt="" />
          <img src="/palmeiras.png" className="absolute bottom-[20%] right-[10%] w-56" alt="" />
          <img src="/floresta.png" className="absolute bottom-[-20%] left-[-20%] w-[140%] opacity-80" alt="" />
          <img src="/floresta.png" className="absolute top-[-20%] right-[-20%] w-[140%] opacity-80 rotate-180" alt="" />
          <img src="/cloud.png" className="absolute top-[30%] right-[15%] w-48 opacity-60" alt="" />
          <img src="/cloud.png" className="absolute bottom-[40%] left-[10%] w-40 opacity-50" alt="" />
        </motion.div>
      ))}
    </div>
  );
};

export function PanicOverlay({ isOpen, onClose, themeMode, kidsTheme, isSmsSent = false }: PanicOverlayProps) {
  const [phase, setPhase] = useState<'Inspire...' | 'Segure...' | 'Expire...'>('Inspire...');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let cleanup = false;
    
    const cycle = async () => {
      while (!cleanup) {
        setPhase('Inspire...');
        await new Promise(r => setTimeout(r, 4000));
        if (cleanup) break;
        setPhase('Segure...');
        await new Promise(r => setTimeout(r, 4000));
        if (cleanup) break;
        setPhase('Expire...');
        await new Promise(r => setTimeout(r, 6000));
      }
    };
    
    cycle();

    return () => { 
      cleanup = true; 
    };
  }, [isOpen]);

  const getMascot = () => {
    if (kidsTheme === 'dino') return '🦖';
    if (kidsTheme === 'cars') return '🚗';
    if (kidsTheme === 'animals') return '🐶';
    if (kidsTheme === 'magic') return '🦄';
    return '🌟';
  };

  const getScale = (phaseStr: string) => {
    return phaseStr === 'Inspire...' ? 1.8 : phaseStr === 'Expire...' ? 0.8 : 1.8;
  };

  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isChildTheme = isSpaceTheme || isDinoTheme;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-[#02050b] flex flex-col items-center justify-between p-6 pt-24 pb-12 overflow-hidden"
        >
          {/* Full Screen 3D Canvas Background for Space Theme */}
          {isDinoTheme && <DinoPanicBackground />}
          {isSpaceTheme && (
            <div className="absolute inset-0 z-0 pointer-events-auto">
              <Canvas 
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={1}
                performance={{ min: 0.5 }}
              >
                <Suspense fallback={<Loader />}>
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[10, 10, 10]} intensity={2} />
                  <Environment preset="city" />
                  <SpaceBoiModel phase={phase} />
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                </Suspense>
              </Canvas>
            </div>
          )}

          <div className="text-center z-10 space-y-2 pointer-events-none mt-8">
            <h1 className="text-3xl font-light text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Você está seguro</h1>
            <p className="text-accent-blue/80 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Concentre-se na sua respiração</p>
          </div>

          <div className="flex-1 w-full flex items-center justify-center relative pointer-events-none">
            {!isChildTheme && (
              <AnimatePresence mode='popLayout'>
                <motion.div
                  key={phase}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: getScale(phase), 
                    opacity: 1 
                  }}
                  transition={{ duration: phase === 'Inspire...' ? 4 : phase === 'Expire...' ? 6 : 4, ease: "easeInOut" }}
                  className="absolute w-48 h-48 flex items-center justify-center pointer-events-none rounded-full border border-accent-blue/40"
                >
                  <div className="absolute inset-0 rounded-full border border-accent-blue/20 scale-125" />
                  <div className="absolute inset-0 rounded-full border border-accent-blue/10 scale-150" />
                  <div className="absolute inset-0 rounded-full border border-accent-blue/5 scale-[1.75]" />
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div 
              className={`w-48 h-48 flex flex-col items-center justify-center z-10 ${isChildTheme ? '' : 'backdrop-blur-md border border-accent-blue/50 shadow-[0_0_60px_rgba(56,189,248,0.3)] rounded-full bg-gradient-to-tr from-accent-blue/30 to-accent-blue/5'}`}
            >
              {!isChildTheme && themeMode === 'child' ? (
                <motion.div
                  key={`mascot-${phase}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: phase === 'Inspire...' ? 1.2 : phase === 'Expire...' ? 0.9 : 1.2 }}
                  transition={{ duration: phase === 'Inspire...' ? 4 : phase === 'Expire...' ? 6 : 4, ease: "easeInOut" }}
                  className="text-6xl mb-2 drop-shadow-xl"
                >
                  {getMascot()}
                </motion.div>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.p 
                  key={phase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className={`text-white text-2xl font-light tracking-wide text-center drop-shadow-md z-10 ${isChildTheme ? 'absolute top-12 text-4xl font-bold drop-shadow-[0_4px_15px_rgba(0,0,0,1)]' : ''}`}
                >
                  {phase}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {isSmsSent && (
            <div className="w-full flex justify-center mb-6 z-10 pointer-events-none">
              <div className="flex items-center gap-3 text-accent-blue text-sm bg-[#060b13]/80 backdrop-blur-md px-4 py-2 rounded-full border border-accent-blue/20">
                <div className="w-3 h-3 rounded-full bg-accent-blue animate-pulse" />
                <span>Rede de apoio notificada</span>
              </div>
            </div>
          )}

          <div className="w-full max-w-sm flex flex-col gap-6 z-10 pointer-events-auto">
            {isSmsSent && (
              <div className="flex items-center justify-center gap-2 text-gray-300 text-xs text-center px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Check className="w-4 h-4 text-accent-blue" /> SMS de localização enviado ao contato de apoio
              </div>
            )}
            
            <button 
              onClick={onClose}
              className="w-full py-4 bg-[#060b13]/80 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-white/10 active:bg-white/20 transition-all active:scale-95"
            >
              Encerrar e Voltar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
