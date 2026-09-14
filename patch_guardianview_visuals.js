import fs from 'fs';

let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

// Update CarsHeartbeatPulses
const heartbeatRegex = /function CarsHeartbeatPulses\(\{ dbLevel \}: \{ dbLevel: number \}\) \{[\s\S]*?return \([\s\S]*?\}\);\s*\}/;

const newHeartbeat = `function CarsHeartbeatPulses({ dbLevel }: { dbLevel: number }) {
  const [pulses, setPulses] = useState<{ id: number; x: number; y: number }[]>([]);
  const isExtremeAlert = dbLevel >= 70;
  const isAlert = dbLevel >= 40 && dbLevel < 70;

  useEffect(() => {
    // Pulse rate based on alert
    let currentBPM = 50;
    if (isExtremeAlert) currentBPM = 160;
    else if (isAlert) currentBPM = 110;
    
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
            top: \`\${pulse.y}%\`,
            left: \`\${pulse.x}%\`,
            filter: isExtremeAlert ? "blur(10px)" : "blur(15px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}`;

if (code.match(heartbeatRegex)) {
  code = code.replace(heartbeatRegex, newHeartbeat);
} else {
  console.log("Heartbeat regex not matched");
}

// Update CarsGuardianBackground
const bgRegex = /function CarsGuardianBackground\(\{ dbLevel \}: \{ dbLevel: number \}\) \{[\s\S]*?return \([\s\S]*?\}\);\s*\}/;

const newBg = `function CarsGuardianBackground({ dbLevel }: { dbLevel: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const isExtremeAlert = dbLevel >= 70;
  const isAlert = dbLevel >= 40 && dbLevel < 70;
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const geom = meshRef.current.geometry as THREE.PlaneGeometry;
    const positions = geom.attributes.position;
    
    const time = state.clock.elapsedTime;
    
    // Adjust amplitude and speed based on dbLevel thresholds
    let speed = 0.5;
    let amp = 1.0;
    
    if (isExtremeAlert) {
       speed = 3.5;
       amp = 5.0;
    } else if (isAlert) {
       speed = 2.0;
       amp = 3.0;
    }
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Topography math (dunes)
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
        <planeGeometry args={[150, 150, 100, 100]} />
        <meshBasicMaterial 
          color={isExtremeAlert ? "#666666" : "#333333"}
          wireframe={true}
          transparent={true}
          opacity={isExtremeAlert ? 0.9 : 0.6}
        />
      </mesh>
      
      {/* Underlying solid plane to block background */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[150, 150, 1, 1]} />
        <meshBasicMaterial color="#020202" />
      </mesh>
    </group>
  );
}`;

if (code.match(bgRegex)) {
  code = code.replace(bgRegex, newBg);
} else {
  console.log("Background regex not matched");
}

fs.writeFileSync('src/views/GuardianView.tsx', code);
console.log("Success");
