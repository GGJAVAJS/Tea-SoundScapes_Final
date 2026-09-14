import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// Ensure Edges is imported
if (!code.includes('Edges') && code.includes('@react-three/drei')) {
  code = code.replace(
    "import { PerspectiveCamera, useGLTF, Environment, Html, useProgress, OrbitControls, useAnimations, Sky, Clouds, Cloud } from '@react-three/drei';",
    "import { PerspectiveCamera, useGLTF, Environment, Html, useProgress, OrbitControls, useAnimations, Sky, Clouds, Cloud, Edges } from '@react-three/drei';"
  );
}

// Ensure the new cloud component is added before CarsScene
const newClouds = `
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
          <planeGeometry args={[c.scale * 2, c.scale]} />
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
`;

const sceneIndex = code.indexOf('const CarsScene = () => {');
code = code.slice(0, sceneIndex) + newClouds + code.slice(sceneIndex);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Success");
