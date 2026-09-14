import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

const startBoxes = code.indexOf('const boxes = useMemo(() => {');
const startReturn = code.indexOf('return (', startBoxes);
const startEffectComposer = code.indexOf('<EffectComposer>', startReturn);

const newLogic = `
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
          <mesh key={\`box-\${box.id}\`} position={[box.x, box.height / 2, box.z]}>
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
          <group key={\`pole-\${pole.id}\`} position={[pole.x, 0, pole.z]}>
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

      `;

code = code.substring(0, startBoxes) + newLogic + code.substring(startEffectComposer);
fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Success");
