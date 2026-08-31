import { motion, AnimatePresence } from 'motion/react';
import { Share2, Settings2 } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Html, useProgress, OrbitControls, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { playSound, stopSound, SoundType } from '../lib/audioEngine';

// Preload the large 3D model outside the component tree
useGLTF.preload('/black_hole.glb');

// Simple loading indicator for 3D canvas
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
        <span className="text-white/70 text-xs font-mono font-medium">{Math.floor(progress)}%</span>
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
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | 'animals' | 'magic' | null;
}

export function GuardianView({ 
  monitorActive, setMonitorActive, 
  interventionActive, setInterventionActive, 
  dbLevel, themeMode, kidsTheme 
}: GuardianViewProps) {
  const isSpaceTheme = themeMode === 'child' && kidsTheme === 'space';
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';
  const isChildTheme = isSpaceTheme || isDinoTheme;
  const isAlert = isChildTheme ? dbLevel > 40 : dbLevel > 65;
  
  // State for the settings prompt notification
  const [showSettingsPrompt, setShowSettingsPrompt] = useState(true);

  useEffect(() => {
    setShowSettingsPrompt(true);
  }, []);

  // Audio triggering on alert
  useEffect(() => {
    if (isSpaceTheme && isAlert && interventionActive) {
      // Find what audio to play
      try {
        const userEmail = localStorage.getItem('currentUserEmail') || '';
        const dataStr = localStorage.getItem(`onboardingData_${userEmail}`);
        if (dataStr) {
          const data = JSON.parse(dataStr);
          if (data.refugeSound) {
            playSound(data.refugeSound as SoundType);
          } else {
             // Fallback
             playSound('rosa');
          }
        }
      } catch (e) {}
    } else {
       // Stop playing audio when not alerting
       try {
        const userEmail = localStorage.getItem('currentUserEmail') || '';
        const dataStr = localStorage.getItem(`onboardingData_${userEmail}`);
        if (dataStr) {
          const data = JSON.parse(dataStr);
          if (data.refugeSound) {
            stopSound(data.refugeSound as SoundType);
          }
        }
        stopSound('rosa');
      } catch (e) {}
    }

    // Cleanup on unmount
    return () => {
       stopSound('rosa');
       try {
        const userEmail = localStorage.getItem('currentUserEmail') || '';
        const dataStr = localStorage.getItem(`onboardingData_${userEmail}`);
        if (dataStr) {
          const data = JSON.parse(dataStr);
          if (data.refugeSound) {
            stopSound(data.refugeSound as SoundType);
          }
        }
      } catch(e) {}
    };
  }, [isAlert, isChildTheme, interventionActive]);

  if (isChildTheme) {
    return (
      <div className="fixed inset-0 z-0 bg-black pointer-events-auto">
        {/* 3D Canvas filling the entire screen */}
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }} 
          className="absolute inset-0 w-full h-full"
          dpr={1} // Limit pixel ratio to 1.5 for huge performance boost on mobile
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={<Loader />}>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.1} />
            {isSpaceTheme && <BlackHoleModel dbLevel={dbLevel} />}
            {isDinoTheme && <MeteorModel dbLevel={dbLevel} />}
            {isSpaceTheme && <GalaxiesBackground dbLevel={dbLevel} />}
            <OrbitControls 
               enableZoom={true} 
               enablePan={true} 
               autoRotate={false}
            />
            <EffectComposer multisampling={0}>
              <Bloom luminanceThreshold={0.2}  luminanceSmoothing={0.5} intensity={2.5} />
            </EffectComposer>
          </Suspense>
        </Canvas>

        {/* Top Left Header Overlay */}
        <div className="absolute top-12 left-4 z-10 bg-[#060b13]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5 shadow-2xl pointer-events-none">
          <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-0.5">TEA SoundScapes</p>
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
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mb-1">TEA SoundScapes</p>
        <h1 className="text-3xl font-poppins font-bold tracking-tight text-white leading-tight">
          Sistema Guardião
        </h1>
      </header>

      {/* dB Meter Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10 relative">
        <div className="relative flex items-center justify-center mb-8">
          {/* Glowing background behind the meter */}
          <div className="absolute inset-0 bg-accent-blue/10 blur-3xl rounded-full w-48 h-48 scale-150" />
          
          {/* Minimalist Number Display */}
          <div className="z-20 text-center glass-card-active p-8 rounded-full border border-accent-blue/30 shadow-[0_0_30px_rgba(56,189,248,0.15)] min-w-[200px] min-h-[200px] flex flex-col items-center justify-center relative overflow-hidden">
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

      <div className="space-y-4 mb-24">
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
