import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// 1. Remover o FogWaves Componente
const fogRegex = /\/\/ Componente de Nuvens em Camadas[\s\S]*?const CarsScene = \(\) => \{/;

if (code.match(fogRegex)) {
  code = code.replace(fogRegex, 'const CarsScene = () => {');
} else {
  console.log("Could not find FogWaves");
}

// 2. Remover a renderização do <FogWaves /> dentro da CarsScene
code = code.replace('<FogWaves />', '');

// 3. Modificar o Canvas para suportar alpha={true}
code = code.replace(
  "<Canvas gl={{ antialias: false, powerPreference: 'high-performance' }}>",
  "<Canvas gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}>"
);

// 4. Mudar o fundo do container principal para um gradiente cinza chumbo quente para preto
const bgContainerRegex = /<div className="absolute inset-0 z-0 bg-\[#030303\] overflow-hidden">/;
if (code.match(bgContainerRegex)) {
  code = code.replace(
    bgContainerRegex, 
    '<div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1818] to-[#000000] overflow-hidden">'
  );
}

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Success");
