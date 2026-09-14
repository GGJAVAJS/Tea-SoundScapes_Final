import fs from 'fs';

let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

// Ensure Edges is imported if needed, but we'll use wireframe for performance on 10k vertices.

const newComponents = `
function CarsHeartbeatPulses({ dbLevel }: { dbLevel: number }) {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const isAlert = dbLevel > 40;

  useEffect(() => {
    // Pulse rate based on alert
    const currentBPM = isAlert ? 100 : 50;
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

      const intervalMs = (60 / currentBPM) * 1000;
      timeoutId = setTimeout(spawnPulse, intervalMs);
    };
    
    spawnPulse();
    return () => clearTimeout(timeoutId);
  }, [isAlert]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {pulses.map((pulse) => (
        <motion.div
          key={pulse.id}
          initial={{ scale: 0.5, opacity: 0.1 }}
          animate={{ scale: isAlert ? 4 : 3, opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute w-40 h-40 rounded-full bg-[#888888] mix-blend-screen"
          style={{
            top: \`\${pulse.y}%\`,
            left: \`\${pulse.x}%\`,
            filter: "blur(15px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

function CarsGuardianBackground({ dbLevel }: { dbLevel: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const isAlert = dbLevel > 40;
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const geom = meshRef.current.geometry as THREE.PlaneGeometry;
    const positions = geom.attributes.position;
    
    const time = state.clock.elapsedTime;
    
    // Adjust amplitude and speed based on dbLevel threshold (40dB)
    const speed = isAlert ? 1.5 : 0.5;
    const amp = isAlert ? 2.5 : 1.0;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Topography math (dunes)
      // We combine two sine waves to make undulating dunes that move towards the camera (y axis in plane coordinates)
      const z = Math.sin(x * 0.1 + time * speed) * Math.cos(y * 0.1 - time * speed * 2) * amp + 
                Math.sin(y * 0.05 - time * speed) * (amp * 1.5);
      
      positions.setZ(i, z);
    }
    
    positions.needsUpdate = true;
    geom.computeVertexNormals();
  });
  
  return (
    <group position={[0, -5, -40]}>
      {/* Fog to hide the back edge */}
      <fog attach="fog" args={['#020202', 20, 80]} />
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Plane heavily subdivided for smooth waves */}
        <planeGeometry args={[150, 150, 100, 100]} />
        <meshStandardMaterial 
          color="#050505"
          emissive="#000000"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Underlying solid plane to block background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[150, 150, 1, 1]} />
        <meshBasicMaterial color="#020202" />
      </mesh>
    </group>
  );
}
`;

// Insert the new components right before GuardianView
const viewIndex = code.indexOf('export function GuardianView');
code = code.slice(0, viewIndex) + newComponents + code.slice(viewIndex);

// Update theme logic
code = code.replace(
  "const isChildTheme = isSpaceTheme || isDinoTheme;",
  "const isCarsTheme = themeMode === 'child' && kidsTheme === 'cars';\n  const isChildTheme = isSpaceTheme || isDinoTheme || isCarsTheme;"
);

// Add CarsGuardianBackground inside Canvas
code = code.replace(
  "{isSpaceTheme && <GalaxiesBackground dbLevel={dbLevel} />}",
  "{isSpaceTheme && <GalaxiesBackground dbLevel={dbLevel} />}\n              {isCarsTheme && <CarsGuardianBackground dbLevel={dbLevel} />}"
);

// Add CarsHeartbeatPulses
code = code.replace(
  "        {/* Top Left Header Overlay */}",
  "        {isCarsTheme && <CarsHeartbeatPulses dbLevel={dbLevel} />}\n\n        {/* Top Left Header Overlay */}"
);

// Fix controls (OrbitControls should only be disabled for Dino... wait, Cars uses a fixed camera too for the dunes effect to work best)
code = code.replace(
  "{!isDinoTheme && <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />}",
  "{!(isDinoTheme || isCarsTheme) && <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} />}"
);

fs.writeFileSync('src/views/GuardianView.tsx', code);
console.log("Success");
