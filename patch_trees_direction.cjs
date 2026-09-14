const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');

const runningForestRegex = /function RunningForest\(\{ dbLevel \}: \{ dbLevel: number \}\) \{[\s\S]*?return \([\s\S]*?<\/group>\s*\);\s*\}/;

const newRunningForest = `function RunningForest({ dbLevel }: { dbLevel: number }) {
  const trees = useMemo(() => {
    return Array.from({ length: 80 }).map(() => ({
      x: (Math.random() - 0.5) * 80, // Width spread
      z: 20 - Math.random() * 300, // Depth spread
      scale: 1 + Math.random() * 3,
      speed: 20 + Math.random() * 10
    })).filter(t => Math.abs(t.x) > 5); // Keep a path in the middle
  }, []);

  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      const speedMultiplier = 1 + Math.max(0, (dbLevel - 30) / 40);
      group.current.children.forEach((child, i) => {
        const treeData = trees[i];
        // Move trees into the distance (-Z) to simulate moving backward while T-Rex runs towards us
        child.position.z -= treeData.speed * speedMultiplier * delta;
        if (child.position.z < -250) {
          child.position.z = 20 + Math.random() * 50;
        }
      });
    }
  });

  return (
    <group ref={group} position={[0, -5, 0]}>
      {trees.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]}>
          <coneGeometry args={[t.scale * 2, t.scale * 15, 5]} />
          <meshStandardMaterial color="#0a1f10" flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}`;

code = code.replace(runningForestRegex, newRunningForest);
fs.writeFileSync('src/views/GuardianView.tsx', code);
