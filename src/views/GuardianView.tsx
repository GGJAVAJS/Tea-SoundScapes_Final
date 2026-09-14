import { SpaceBloomShader } from "../components/ui/SpaceBloomShader";

import { motion, AnimatePresence } from 'motion/react';
import { Share2, Settings2 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF, Environment, Html, useProgress, OrbitControls, Sparkles, useAnimations, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { playSound, stopSound, SoundType } from '../lib/audioEngine';

import { ErrorBoundary } from '../components/ErrorBoundary';
import { MistyLakeShader } from '../components/ui/MistyLakeShader';

// Preload the large 3D model outside the component tree

// Simple loading indicator for 3D canvas
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2 bg-black/50 p-4 rounded-xl backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
        <span className="text-white text-sm font-medium whitespace-nowrap">Carregando modelo...</span>
      </div>
    </Html>
  );
}

function MeteorModel({ dbLevel }: { dbLevel: number }) {
  const spinGroup = useRef<THREE.Group>(null);
  const meteorGlb = useGLTF('/meteor.glb');
  
  const isAlert = dbLevel >= 40;
  
  useFrame((state, delta) => {
    if (spinGroup.current) {
      spinGroup.current.rotation.y += delta * (isAlert ? 2 : 0.5);
      spinGroup.current.rotation.x += delta * (isAlert ? 1 : 0.2);
    }
  });

  return (
    <group ref={spinGroup} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
      <primitive object={meteorGlb.scene} />
      <directionalLight position={[5, 5, 5]} intensity={isAlert ? 2 : 1} color={isAlert ? "#ff5500" : "#ffffff"} />
      {isAlert && (
        <Sparkles 
          count={100} 
          scale={3} 
          size={8} 
          speed={0.4} 
          opacity={0.8} 
          color="#ff3300"
        />
      )}
      {isAlert && (
        <Sparkles 
          count={50} 
          scale={4} 
          size={12} 
          speed={0.8} 
          opacity={0.6} 
          color="#ff8800"
        />
      )}
    </group>
  );
}

function BlackHoleModel({ dbLevel }: { dbLevel: number }) {
  const spinGroup = useRef<THREE.Group>(null);
  const blackHoleGlb = useGLTF('/black_hole.glb');
  
  // Intensidade e velocidade baseadas no som
  const intensity = Math.max(0, Math.min(1, (dbLevel - 30) / 60)); 
  const speed = 1 + intensity * 6;

  // Realça o brilho dos materiais para capturar o efeito Bloom
  useEffect(() => {
    blackHoleGlb.scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.emissiveMap || mat.emissive) {
          mat.emissiveIntensity = 3.0; // Boost no brilho emissivo
          mat.needsUpdate = true;
        }
      }
    });
  }, [blackHoleGlb]);

  useFrame((state, delta) => {
    if (spinGroup.current) {
      spinGroup.current.rotation.y -= delta * 0.1 * speed;
    }
  });

  return (
    <group rotation={[0.35, 0, -0.45]} position={[0, -0.2, 0]} scale={0.005}>
      <group ref={spinGroup}>
        <primitive object={blackHoleGlb.scene} />
      </group>
    </group>
  );
}

// Components for Spiral Galaxies

function DetailedGalaxy({ 
  position, 
  rotation, 
  scale, 
  tint, 
  opacityTarget 
}: { 
  position: [number, number, number], 
  rotation: [number, number, number], 
  scale: number, 
  tint: string, 
  opacityTarget: number 
}) {
  const ref = useRef<THREE.Points>(null);
  const particlesCount = 800; // Optimized from 5000 to 800 for better performance
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);
    const colorInside = new THREE.Color(tint).offsetHSL(0, 0.5, 0.4);
    const colorOutside = new THREE.Color(tint).offsetHSL(0.1, -0.2, -0.2);
    const coreBright = new THREE.Color(0xffffff);
    const color = new THREE.Color();
    
    for(let i = 0; i < particlesCount; i++) {
       const r = Math.pow(Math.random(), 1.8) * 6; 
       const spinAngle = r * 1.5;
       const branchAngle = (i % 3) * ((Math.PI * 2) / 3); // 3 braços espirais
       
       const spread = (Math.random() - 0.5) * (6 - r) * 0.15;
       const y = (Math.random() - 0.5) * (6 - r) * 0.08 * (Math.random() < 0.2 ? 3 : 1);
       
       pos[i*3] = Math.cos(branchAngle + spinAngle) * r + (Math.random() - 0.5) * spread;
       pos[i*3+1] = y;
       pos[i*3+2] = Math.sin(branchAngle + spinAngle) * r + (Math.random() - 0.5) * spread;
       
       const mixRatio = Math.min(1, Math.max(0, r / 6));
       if (r < 0.5) {
         color.lerpColors(coreBright, colorInside, r * 2);
       } else {
         color.lerpColors(colorInside, colorOutside, mixRatio);
       }
       
       col[i*3] = color.r;
       col[i*3+1] = color.g;
       col[i*3+2] = color.b;
    }
    return { positions: pos, colors: col };
  }, [tint]);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacityTarget, delta);
    }
  });
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
       <points ref={ref}>
         <bufferGeometry>
           <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
           <bufferAttribute attach="attributes-color" count={particlesCount} array={colors} itemSize={3} />
         </bufferGeometry>
         <pointsMaterial size={0.04} vertexColors transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
       </points>
    </group>
  );
}

function GalaxiesBackground({ dbLevel }: { dbLevel: number }) {
  const isActive = dbLevel > 40;
  const targetOp = isActive ? Math.min(1, (dbLevel - 40) / 40) : 0;
  
  const galaxies = useMemo(() => {
    const palette = ["#ff6644", "#4488ff", "#aa44ff", "#44ffaa", "#ffaa44", "#ff44aa", "#44aaff", "#ffff44", "#ff4444", "#44ffff", "#ffffff", "#ff88ff"];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 250, 
        (Math.random() - 0.5) * 150, 
        -30 - Math.random() * 150 // Keep them mostly behind the black hole
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 1.5 + Math.random() * 8,
      tint: palette[Math.floor(Math.random() * palette.length)],
      baseOpacity: 0.4 + Math.random() * 0.6
    }));
  }, []);
  
  return (
    <group>
      {galaxies.map(g => (
        <DetailedGalaxy 
          key={g.id}
          position={g.position}
          rotation={g.rotation}
          scale={g.scale}
          tint={g.tint}
          opacityTarget={targetOp * g.baseOpacity}
        />
      ))}
    </group>
  );
}

interface GuardianViewProps {
  monitorActive: boolean;
  setMonitorActive: (v: boolean) => void;
  interventionActive: boolean;
  setInterventionActive: (v: boolean) => void;
  dbLevel: number;
  micSensitivity: number;
  setMicSensitivity: (v: number) => void;
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | null;
  onPanic?: () => void;
}

function TRexModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/animated_tyrannosaurus_rex_dinosaur_running_loop_corrigido.glb');
  const { actions } = useAnimations(animations, scene);
  
  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) {
          action.reset().play();
        }
      });
    }
  }, [actions]);

  return (
    // Centered and facing forward so OrbitControls can freely orbit around it
    <group ref={group} position={[0, -2, 0]} rotation={[0, 0, 0]}>
      <primitive object={scene} scale={0.8} />
    </group>
  );
}

function TreadmillEnvironment() {
  const trees = useMemo(() => {
    return Array.from({ length: 150 }).map(() => {
      // Much narrower spread on the X axis so trees are visible on tall mobile screens
      const x = (Math.random() - 0.5) * 25; 
      const z = (Math.random() - 0.5) * 80;
      // Leave a very tight clear path in the middle for the TRex
      if (Math.abs(x) < 2.0) return null;
      return {
        x,
        z,
        scale: 1 + Math.random() * 2,
      };
    }).filter(Boolean) as {x: number, z: number, scale: number}[];
  }, []);

  const treeGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (treeGroup.current) {
      treeGroup.current.children.forEach((child) => {
        // Move trees backwards relative to the TRex at a slow walking pace
        child.position.z -= delta * 2.5; 
        if (child.position.z < -40) {
          child.position.z += 80;
        }
      });
    }
  });

  return (
    <group position={[0, -2, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#112211" roughness={1} />
      </mesh>

      <group ref={treeGroup}>
        {trees.map((t, i) => (
          <mesh key={i} position={[t.x, 0, t.z]} rotation={[0, Math.random() * Math.PI, 0]} castShadow receiveShadow>
            <coneGeometry args={[t.scale * 1.5, t.scale * 10, 5]} />
            <meshStandardMaterial color="#0a2a10" flatShading roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DinoInteractiveScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#0a192f]">
      <ErrorBoundary>
        <Canvas 
          camera={{ position: [0, 1, 6], fov: 50 }} 
          className="absolute inset-0 w-full h-full"
          dpr={1}
          shadows
        >
          <color attach="background" args={['#0a192f']} />
          <fog attach="fog" args={['#0a192f', 5, 40]} />
          
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            
            <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            
            <TreadmillEnvironment />
            <TRexModel />
            
            <OrbitControls 
              enablePan={false} 
              minDistance={3} 
              maxDistance={12} 
              maxPolarAngle={Math.PI / 2 - 0.05} 
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}


function CarsHeartbeatPulses({ dbLevel }: { dbLevel: number }) {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const isExtremeAlert = dbLevel >= 70;
  const isAlert = dbLevel >= 40 && dbLevel < 70;

  useEffect(() => {
    // Pulse rate based on alert
    let currentBPM = 50;
    if (isExtremeAlert) currentBPM = 160;
    else if (isAlert) currentBPM = 100;
    
    let timeoutId: NodeJS.Timeout;

    const spawnPulse = () => {
      setPulses((prev) => [
        ...prev.slice(isExtremeAlert ? -5 : -3),
        {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        },
      ]);

      const intervalMs = (60 / currentBPM) * 1000;
      timeoutId = setTimeout(spawnPulse, intervalMs);
    };
    
    spawnPulse();
    return () => clearTimeout(timeoutId);
  }, [isAlert, isExtremeAlert]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {pulses.map((pulse) => (
        <motion.div
          key={pulse.id}
          initial={{ scale: 0.5, opacity: 0.1 }}
          animate={{ scale: isExtremeAlert ? 5 : (isAlert ? 4 : 3), opacity: 0 }}
          transition={{ duration: isExtremeAlert ? 1.0 : 2.5, ease: "easeOut" }}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: isExtremeAlert ? '16rem' : '10rem',
            height: isExtremeAlert ? '16rem' : '10rem',
            backgroundColor: isExtremeAlert ? "#ffffff" : "#888888",
            top: `${pulse.y}%`,
            left: `${pulse.x}%`,
            filter: isExtremeAlert ? "blur(10px)" : "blur(15px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}



function CarsTrafficLightBackground({ dbLevel }: { dbLevel: number }) {
  const isExtremeAlert = dbLevel >= 70;
  const isAlert = dbLevel >= 40 && dbLevel < 70;
  const isSafe = dbLevel < 40;
  
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1a1a] to-[#000000] overflow-hidden flex items-center justify-center pointer-events-none">
      {/* Film Grain */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      
      {/* Semáforo (Traffic Light Pillar) */}
      <div className="relative z-10 w-28 h-72 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-evenly py-6 overflow-hidden mt-8">
        
        {/* Red Light */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <motion.div
             animate={{
               opacity: isExtremeAlert ? 1 : 0.05,
               scale: isExtremeAlert ? [1, 1.2, 1] : 1,
             }}
             transition={{
               scale: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute inset-0 rounded-full bg-[#ef4444] mix-blend-screen"
             style={{ filter: isExtremeAlert ? "blur(15px)" : "blur(4px)" }}
          />
          <div className={`w-10 h-10 rounded-full z-10 transition-colors duration-500 ${isExtremeAlert ? 'bg-red-500 shadow-[0_0_25px_#ef4444]' : 'bg-red-950/40 border border-red-900/30'}`} />
        </div>

        {/* Yellow Light */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <motion.div
             animate={{
               opacity: isAlert ? 1 : 0.05,
               scale: isAlert ? [1, 1.15, 1] : 1,
             }}
             transition={{
               scale: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute inset-0 rounded-full bg-[#f59e0b] mix-blend-screen"
             style={{ filter: isAlert ? "blur(15px)" : "blur(4px)" }}
          />
          <div className={`w-10 h-10 rounded-full z-10 transition-colors duration-500 ${isAlert ? 'bg-amber-400 shadow-[0_0_25px_#f59e0b]' : 'bg-amber-950/40 border border-amber-900/30'}`} />
        </div>

        {/* Green Light */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <motion.div
             animate={{
               opacity: isSafe ? 1 : 0.05,
               scale: isSafe ? [1, 1.1, 1] : 1,
             }}
             transition={{
               scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
             }}
             className="absolute inset-0 rounded-full bg-[#10b981] mix-blend-screen"
             style={{ filter: isSafe ? "blur(20px)" : "blur(4px)" }}
          />
          <div className={`w-10 h-10 rounded-full z-10 transition-colors duration-500 ${isSafe ? 'bg-emerald-400 shadow-[0_0_25px_#10b981]' : 'bg-emerald-950/40 border border-emerald-900/30'}`} />
        </div>
        
      </div>
    </div>
  );
}

export function GuardianView({ 
  monitorActive, setMonitorActive, 
  interventionActive, setInterventionActive, 
  dbLevel, micSensitivity, setMicSensitivity, 
  themeMode, kidsTheme, onPanic
}: GuardianViewProps) {
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';
  const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;
  useEffect(() => {
    if (isCarsTheme && dbLevel >= 70 && onPanic) {
      onPanic();
    }
  }, [dbLevel, isCarsTheme, onPanic]);

  const isAlert = isChildTheme ? dbLevel > 40 : dbLevel > 65;
  
  // State for the settings prompt notification
  const [showSettingsPrompt, setShowSettingsPrompt] = useState(true);

  useEffect(() => {
    setShowSettingsPrompt(true);
  }, []);

  // Audio triggering logic removed as requested.

  if (isChildTheme) {
    return (
      <div className="fixed inset-0 z-0 bg-black pointer-events-auto">
        {/* 3D Canvas filling the entire screen */}
        
        {isSpaceTheme && (
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <SpaceBloomShader />
            {/* Adding the deep space radial gradient for UI legibility over the shader */}
            <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_150%,rgba(0,0,0,0.0),rgba(0,0,0,0.4))]" />
          </div>
        )}
        {isDinoTheme && (
          <DinoInteractiveScene />
        )}
        {isCarsTheme && <CarsTrafficLightBackground dbLevel={dbLevel} />}


        {isCarsTheme && <CarsHeartbeatPulses dbLevel={dbLevel} />}

        {/* Top Left Header Overlay */}
        <div className="absolute top-12 left-4 z-10 bg-[#060b13]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5 shadow-2xl pointer-events-none">
          <p className="text-[10px] text-white font-bold tracking-widest uppercase mb-0.5">TEA SoundScapes</p>
          <h1 className="text-xl font-bold text-white tracking-tight">Sistema Guardião</h1>
        </div>

        {/* Top Right dB Overlay */}
        <div className="absolute top-12 right-4 z-10 bg-[#060b13]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5 flex items-baseline gap-1 shadow-2xl transition-colors duration-500 pointer-events-none" style={{ borderColor: isAlert ? 'rgba(244,63,94,0.3)' : 'rgba(255,255,255,0.05)' }}>
          <span className="text-4xl font-bold transition-colors duration-500" style={{ color: isAlert ? '#f43f5e' : '#ffffff' }}>{dbLevel}</span>
          <span className="text-lg text-gray-400">dB</span>
        </div>

        {/* Settings Notification Overlay */}
        <AnimatePresence>
          {showSettingsPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute inset-x-4 bottom-28 z-50 bg-[#060b13]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl max-w-md mx-auto"
            >
              <h2 className="text-lg font-bold text-white mb-2">Monitoramento Ambiental</h2>
              <p className="text-sm text-gray-400 mb-6">Deseja ativar o Guardião para monitorar o ruído e intervir em crises?</p>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-200 text-sm">Microfone (Análise Local)</span>
                  <button 
                    onClick={() => setMonitorActive(!monitorActive)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${monitorActive ? 'bg-accent-blue' : 'bg-gray-600'}`}
                  >
                    <motion.div 
                      layout
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                      style={{ marginLeft: monitorActive ? '1.5rem' : '0' }}
                    />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-200 text-sm">Intervenção de Áudio</span>
                  <button 
                      onClick={() => setInterventionActive(!interventionActive)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${interventionActive ? 'bg-accent-blue' : 'bg-gray-600'}`}
                    >
                      <motion.div 
                        layout
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                        style={{ marginLeft: interventionActive ? '1.5rem' : '0' }}
                      />
                    </button>
                </div>
                
              </div>
              <button 
                onClick={() => setShowSettingsPrompt(false)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Confirmar e Fechar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Toggle Button if modal is closed */}
        <AnimatePresence>
          {!showSettingsPrompt && (
            <motion.button 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => setShowSettingsPrompt(true)}
              className="absolute bottom-28 right-4 z-10 bg-[#060b13]/80 backdrop-blur-md p-3 rounded-full border border-white/10 text-white shadow-lg"
            >
              <Settings2 className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Adult Mode (Original Layout)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 pt-16 flex flex-col h-full max-w-md mx-auto"
    >
      <header className="mb-12">
        <p className="text-xs text-white font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-poppins font-bold tracking-tight text-white leading-tight">
          Sistema Guardião
        </h1>
      </header>

      {/* dB Meter Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10 relative">
        <div className="relative flex items-center justify-center mb-8">
          {/* Minimalist Number Display */}
          <div className="z-20 text-center glass-card-active p-8 rounded-full border border-accent-blue/30 shadow-[0_0_60px_rgba(56,189,248,0.15)] min-w-[200px] min-h-[200px] flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-accent-blue/10"
                animate={{ height: `${Math.min(dbLevel, 100)}%` }}
                transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="text-7xl font-light tracking-tight flex items-baseline justify-center gap-1 relative z-10"
              animate={{ color: isAlert ? '#f43f5e' : '#ffffff' }}
              transition={{ duration: 0.5 }}
            >
              {dbLevel} <span className="text-3xl text-gray-400 font-normal">dB</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-24 relative z-10">
        <div className="glass-card p-5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-200 text-lg">Monitoramento Ambiental</span>
            <button 
              onClick={() => setMonitorActive(!monitorActive)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${monitorActive ? 'bg-accent-blue' : 'bg-gray-600'}`}
            >
              <motion.div 
                layout
                className="w-6 h-6 bg-white rounded-full shadow-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ marginLeft: monitorActive ? '1.5rem' : '0' }}
              />
            </button>
          </div>
          <p className="text-sm text-gray-400">Processamento 100% local · sem gravar vozes</p>
        </div>

        <div className="glass-card p-5 flex justify-between items-center">
          <span className="font-medium text-gray-200 text-lg">Intervenção com Fade-in</span>
          <button 
              onClick={() => setInterventionActive(!interventionActive)}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${interventionActive ? 'bg-accent-blue' : 'bg-gray-600'}`}
            >
              <motion.div 
                layout
                className="w-6 h-6 bg-white rounded-full shadow-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{ marginLeft: interventionActive ? '1.5rem' : '0' }}
              />
            </button>
        </div>

      </div>
    </motion.div>
  );
}
