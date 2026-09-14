const fs = require('fs');
let code = fs.readFileSync('/app/applet/src/views/PanicOverlay.tsx', 'utf8');

if (!code.includes('PerspectiveCamera')) {
  code = code.replace(/import \{ useGLTF/, 'import { PerspectiveCamera, useGLTF');
}

// 1. Rewrite PterodactylModel to stay in place (with a bob) and hold the camera
const pteroRegex = /function PterodactylModel\(\) \{[\s\S]*?return \([\s\S]*?<group ref=\{group\} position=\{\[0, 40, -100\]\}>[\s\S]*?<primitive object=\{scene\} scale=\{2\} rotation=\{\[0, Math\.PI, 0\]\} \/>[\s\S]*?<\/group>[\s\S]*?\);[\s\S]*?\}/;
const newPtero = `function PterodactylModel() {
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

  useFrame((state) => {
    if (group.current) {
      // Bob up and down to simulate flight
      group.current.position.y = 40 + Math.sin(state.clock.elapsedTime * 3) * 2;
    }
  });

  return (
    <group ref={group} position={[0, 40, 0]}>
      <PerspectiveCamera makeDefault position={[0, 4, -4]} rotation={[-0.1, Math.PI, 0]} fov={75} />
      <primitive object={scene} scale={2} rotation={[0, Math.PI, 0]} />
    </group>
  );
}`;
code = code.replace(pteroRegex, newPtero);

// 2. Rewrite ForestCanopy to move its trees in +Z (since Ptero faces -Z, moving trees +Z makes it look like it's flying -Z)
const forestRegex = /function ForestCanopy\(\) \{[\s\S]*?return \([\s\S]*?<\/group>[\s\S]*?\);[\s\S]*?\}/;
const newForest = `function ForestCanopy() {
  const trees = useMemo(() => {
    return Array.from({ length: 200 }).map(() => ({
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
          <coneGeometry args={[t.scale * 2, t.scale * 8, 5]} />
          <meshStandardMaterial color="#1f3a15" flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}`;
code = code.replace(forestRegex, newForest);

// 3. Remove OrbitControls from DinoPanicBackground and wrap Clouds in a moving group
const cloudsRegex = /<Clouds material=\{THREE\.MeshBasicMaterial\}>[\s\S]*?<\/Clouds>/;
const newClouds = `
          <MovingClouds />
`;
code = code.replace(cloudsRegex, newClouds);

const orbitRegex = /<OrbitControls[\s\S]*?autoRotateSpeed=\{0\.5\}\s*\/>/;
code = code.replace(orbitRegex, '');

// Add MovingClouds component
const movingCloudsComp = `
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
        <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#ffffff" position={[0, 80, -100]} />
        <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#f0f0f0" position={[80, 60, -50]} />
        <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#e0e0e0" position={[-80, 70, -80]} />
        
        {/* Mirrored clouds for looping */}
        <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#ffffff" position={[0, 80, -400]} />
        <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#f0f0f0" position={[80, 60, -350]} />
        <Cloud segments={20} bounds={[50, 10, 50]} volume={20} color="#e0e0e0" position={[-80, 70, -380]} />
      </Clouds>
    </group>
  );
}
`;

const insertIdx = code.indexOf('const DinoPanicBackground = () =>');
code = code.substring(0, insertIdx) + movingCloudsComp + '\n' + code.substring(insertIdx);

fs.writeFileSync('/app/applet/src/views/PanicOverlay.tsx', code);
