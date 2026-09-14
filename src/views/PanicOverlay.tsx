import GenerativeArtSceneV3 from '../components/ui/quantum-nebula';
import SpacePanicShader from '../components/ui/space-panic-shader';
import { playSound, stopSound, setVolume } from '../lib/audioEngine';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import React from 'react';
import { Check, Car } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF, Environment, Html, useProgress, OrbitControls, useAnimations, Sky, Clouds, Cloud, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { NightCloudsShader } from '../components/ui/NightCloudsShader';

import { ErrorBoundary } from '../components/ErrorBoundary';

// Preload the space boi model

// Simple loading indicator for 3D canvas
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2 bg-black/50 p-4 rounded-xl backdrop-blur-sm">
        <div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
        <span className="text-white text-sm font-medium whitespace-nowrap">Carregando modelo...</span>
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
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
  isSmsSent?: boolean;
}

// Dinosaur Models

function PterodactylModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/animated_flying_pteradactal_dinosaur_loop.glb');
  const { actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    const action = actions[Object.keys(actions)[0]];
    if (action) {
      action.setEffectiveTimeScale(1.5);
      action.play();
    }
  }, [actions]);

  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame(() => {
    timer.update();
    if (group.current) {
      // Bob up and down to simulate flight
      group.current.position.y = 40 + Math.sin(timer.getElapsed() * 3) * 2;
    }
  });

  return (
    <group ref={group} position={[0, 40, 0]}>
      <PerspectiveCamera makeDefault position={[0, -1, 7]} rotation={[0.1, 0, 0]} fov={75} />
      <primitive object={scene} scale={2} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

function ForestCanopy() {
  const trees = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      x: (Math.random() - 0.5) * 300,
      z: (Math.random() - 0.5) * 300,
      scale: 2 + Math.random() * 4,
    }));
  }, []);

  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.children.forEach((child) => {
        child.position.z += delta * 60; // Move towards camera
        if (child.position.z > 150) {
          child.position.z -= 300; // loop back
        }
      });
    }
  });

  return (
    <group ref={group} position={[0, -20, 0]}>
      {trees.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]} rotation={[0, Math.random() * Math.PI, 0]}>
          <coneGeometry args={[t.scale * 2, t.scale * 8, 4]} />
          <meshStandardMaterial color="#1f3a15" flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}


function MovingClouds() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.z += delta * 40;
      if (group.current.position.z > 150) group.current.position.z -= 300;
    }
  });
  return (
    <group ref={group}>
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={8} bounds={[50, 10, 50]} volume={20} color="#ffffff" position={[0, 80, -100]} />
        <Cloud segments={8} bounds={[50, 10, 50]} volume={20} color="#f0f0f0" position={[80, 60, -50]} />
        <Cloud segments={8} bounds={[50, 10, 50]} volume={20} color="#e0e0e0" position={[-80, 70, -80]} />
        
        {/* Mirrored clouds for looping */}
        <Cloud segments={8} bounds={[50, 10, 50]} volume={20} color="#ffffff" position={[0, 80, -400]} />
        <Cloud segments={8} bounds={[50, 10, 50]} volume={20} color="#f0f0f0" position={[80, 60, -350]} />
        <Cloud segments={8} bounds={[50, 10, 50]} volume={20} color="#e0e0e0" position={[-80, 70, -380]} />
      </Clouds>
    </group>
  );
}

const DinoPanicBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto bg-[#0a0f1a]">
      <ErrorBoundary>
        <Canvas 
          camera={{ position: [0, -10, 0], fov: 75 }} 
          dpr={1} 
          performance={{ min: 0.5 }}
          gl={{ powerPreference: 'high-performance', antialias: false }}
        >
          <Suspense fallback={<Loader />}>
            <NightCloudsShader />
            <ambientLight intensity={1.5} color="#cceeff" />
            <directionalLight position={[50, 100, -50]} intensity={2.5} castShadow />
            
            <PterodactylModel />
            
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};



const SparseClouds = () => {
  const cloudsRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.children.forEach((cloud, i) => {
        cloud.position.x += Math.sin(state.clock.elapsedTime * 0.1 + i) * 2 * delta;
        cloud.position.z += 2 * delta;
        if (cloud.position.z > 0) {
          cloud.position.z = -200;
        }
      });
    }
  });

  const cloudData = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 150,
      y: 15 + Math.random() * 20,
      z: -100 - Math.random() * 100,
      scale: 10 + Math.random() * 20
    }));
  }, []);

  return (
    <group ref={cloudsRef}>
      {cloudData.map(c => (
        <mesh key={c.id} position={[c.x, c.y, c.z]}>
          <circleGeometry args={[c.scale, 32]} />
          <meshBasicMaterial 
            color="#1a1a1a" 
            transparent 
            opacity={0.15} 
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};
const CarsScene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sceneGroup = useRef<THREE.Group>(null);
  
  const [mode, setMode] = useState<1 | 2>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMode(prev => (prev === 1 ? 2 : 1));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (sceneGroup.current) {
      sceneGroup.current.position.z += 15 * delta;
      if (sceneGroup.current.position.z > 50) {
        sceneGroup.current.position.z = 0;
      }
    }

    if (cameraRef.current) {
      const targetPosition = mode === 1 
        ? new THREE.Vector3(0, 40, 0)
        : new THREE.Vector3(0, 2, 10);
        
      const targetRotation = mode === 1 
        ? new THREE.Euler(-Math.PI / 2, 0, 0)
        : new THREE.Euler(-0.05, 0, 0);
      
      // Transição muito mais lenta e cinemática (ajuste de tempo)
      const lerpFactor = 0.5 * delta;

      cameraRef.current.position.lerp(targetPosition, lerpFactor);
      
      const currentQuat = cameraRef.current.quaternion;
      const targetQuat = new THREE.Quaternion().setFromEuler(targetRotation);
      currentQuat.slerp(targetQuat, lerpFactor);
    }
  });

  
  const boxes = useMemo(() => {
    const items = [];
    for(let i = 0; i < 60; i++) {
      const z = Math.random() * -200;
      // Prédios nas margens (um pouco mais afastados para criar uma rua central)
      const isRight = Math.random() > 0.5;
      const x = (isRight ? 1 : -1) * (Math.random() * 25 + 12); 
      // Variação drástica de altura para simular um skyline urbano
      const height = Math.random() * 30 + 10;
      const width = Math.random() * 6 + 4;
      const depth = Math.random() * 6 + 4;
      items.push({ id: i, x, z, height, width, depth });
    }
    return items;
  }, []);

  const poles = useMemo(() => {
    const items = [];
    for(let i = 0; i < 30; i++) {
      const z = Math.random() * -200;
      const isRight = Math.random() > 0.5;
      const x = (isRight ? 1 : -1) * 6;
      items.push({ id: i, x, z, isRight });
    }
    return items;
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 40, 0]} rotation={[-Math.PI / 2, 0, 0]} fov={60} />
      
      <ambientLight intensity={0.8} />
      <directionalLight position={[0, 15, 5]} intensity={1.2} />

      <SparseClouds />

      <group ref={sceneGroup}>
        {/* Estrada */}
        <mesh position={[0, 0, -100]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 400]} />
          <meshBasicMaterial color="#080808" />
        </mesh>
        
        {/* Linha Tracejada */}
        <mesh position={[0, 0.05, -100]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 400]} />
          <meshBasicMaterial color="#444444" />
        </mesh>

        {/* Chão lateral */}
        <mesh position={[0, -0.1, -100]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshBasicMaterial color="#030303" />
        </mesh>

        {/* Skyline: Prédios (Cinza médio com emissive sutil e Edges) */}
        {boxes.map(box => (
          <mesh key={`box-${box.id}`} position={[box.x, box.height / 2, box.z]}>
            <boxGeometry args={[box.width, box.height, box.depth]} />
            <meshStandardMaterial 
              color="#2a2a2a" 
              emissive="#151515" 
              roughness={0.9} 
            />
            <Edges scale={1} threshold={15} color="#555555" />
          </mesh>
        ))}

        {/* Postes Urbanos ("L" invertido) */}
        {poles.map(pole => (
          <group key={`pole-${pole.id}`} position={[pole.x, 0, pole.z]}>
            {/* Pilar vertical */}
            <mesh position={[0, 4, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 8, 8]} />
              <meshStandardMaterial color="#333333" emissive="#1a1a1a" roughness={0.8} />
              <Edges scale={1} threshold={15} color="#555555" />
            </mesh>
            {/* Haste horizontal (apontando para a pista) */}
            <mesh position={[(pole.isRight ? -1.5 : 1.5), 8, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.1, 3, 8]} />
              <meshStandardMaterial color="#333333" emissive="#1a1a1a" roughness={0.8} />
              <Edges scale={1} threshold={15} color="#555555" />
            </mesh>
            {/* Lâmpada do poste */}
            <mesh position={[(pole.isRight ? -2.5 : 2.5), 7.9, 0]}>
               <boxGeometry args={[0.4, 0.2, 0.4]} />
               <meshBasicMaterial color="#888888" />
            </mesh>
          </group>
        ))}
      </group>

      <EffectComposer>
        {/* Ruído Cinematográfico (Film Grain) via WebGL para aplicar sobre toda a cena renderizada */}
        <Noise opacity={0.3} premultiply blendFunction={THREE.AdditiveBlending} />
      </EffectComposer>
    </>
  );
};

const CarsPanicBackground = ({ phase }: { phase: 'Inspire...' | 'Segure...' | 'Expire...' }) => {
  const isExpire = phase === 'Expire...';
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let currentBPM = 120;
    const targetBPM = 50;
    let timeoutId: NodeJS.Timeout;

    const spawnPulse = () => {
      setPulses((prev) => [
        ...prev.slice(-3),
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        },
      ]);

      if (currentBPM > targetBPM) {
        currentBPM -= 1;
      }
      
      const intervalMs = (60 / currentBPM) * 1000;
      timeoutId = setTimeout(spawnPulse, intervalMs);
    };
    
    spawnPulse();

    return () => clearTimeout(timeoutId);
  }, []);

  const dropOpacity = isExpire ? 0 : 0.4;

  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1818] to-[#000000] overflow-hidden">
      
      {/* Camada 3D - Background Estética Dark */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}>
             <CarsScene />
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Camada 2D - SVG de Chuva Nativo (Substituído) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center mix-blend-screen"
        style={{ 
          opacity: dropOpacity,
          filter: dropOpacity === 0 ? 'blur(8px)' : 'blur(0px)', 
          transition: "opacity 2s ease, filter 2s ease" 
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid meet" className="w-full h-full opacity-60">
           <defs>
              <linearGradient id="rainGradMinimalist" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="transparent" />
                 <stop offset="50%" stopColor="#ffffff" />
                 <stop offset="100%" stopColor="transparent" />
              </linearGradient>
           </defs>
           <g>
              {[...Array(60)].map((_, i) => {
                const startX = Math.random() * 1080;
                const duration = 0.5 + Math.random() * 1.5;
                const delay = Math.random() * -5;
                const height = 40 + Math.random() * 80;
                
                return (
                  <motion.rect
                    key={`rain-${i}`}
                    x={startX}
                    y={-height}
                    width="2"
                    height={height}
                    fill="url(#rainGradMinimalist)"
                    animate={{
                      y: [ -height, 1080 + height ]
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: "linear",
                      delay
                    }}
                  />
                );
              })}
           </g>
        </svg>
      </div>

      {/* Camada 2D - Pulsos Cardíacos Desfocados */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ scale: 0.5, opacity: 0.1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full bg-[#aaaaaa] mix-blend-screen"
            style={{
              top: `${pulse.y}%`,
              left: `${pulse.x}%`,
              filter: "blur(20px)",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export function PanicOverlay({ isOpen, onClose, themeMode, kidsTheme, isSmsSent = false }: PanicOverlayProps) {
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';
  const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;

  const [phase, setPhase] = useState<'Inspire...' | 'Segure...' | 'Expire...'>('Inspire...');

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    
    // Play background sounds
    if (isCarsTheme) {
      playSound('chuva');
      playSound('ruido_rosa');
    } else if (isSpaceTheme) {
      playSound('delta_suaves').then(() => setVolume('delta_suaves', 0.45));
      playSound('vento').then(() => setVolume('vento', 0.50));
    } else if (isDinoTheme) {
      playSound('vento').then(() => setVolume('vento', 0.55));
    } else {
      playSound('natureza');
      playSound('vento');
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
      if (isCarsTheme) {
        stopSound('chuva');
        stopSound('ruido_rosa');
      } else if (isSpaceTheme) {
        stopSound('delta_suaves');
        stopSound('vento');
      } else {
        stopSound('natureza');
        stopSound('vento');
      }
    };
  }, [isOpen]);

  const getMascot = () => {
    if (kidsTheme === 'dino') return '🦖';
    if (kidsTheme === 'cars') return '🚗';
    return '🌟';
  };

  const getScale = (phaseStr: string) => {
    return phaseStr === 'Inspire...' ? 1.8 : phaseStr === 'Expire...' ? 0.8 : 1.8;
  };

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
          {isCarsTheme && <CarsPanicBackground phase={phase} />}
          {isSpaceTheme && (
            <div className="absolute inset-0 z-0 pointer-events-auto">
              <SpacePanicShader />
              <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),rgba(0,0,0,0.7))]" />
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
              className="w-full py-4 bg-[#111827]/90 backdrop-blur-md border border-white/20 rounded-full text-white font-medium hover:bg-[#374151] hover:border-gray-400/50 active:bg-[#4b5563] shadow-lg hover:shadow-gray-900/50 transition-all active:scale-95"
            >
              Encerrar e Voltar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
