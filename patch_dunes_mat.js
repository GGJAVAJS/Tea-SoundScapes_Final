import fs from 'fs';
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf-8');

code = code.replace(
  /<meshStandardMaterial \s*color="#050505"\s*emissive="#000000"\s*wireframe=\{true\}\s*transparent=\{true\}\s*opacity=\{0.3\}\s*\/>/,
  `<meshBasicMaterial 
          color="#333333"
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />`
);

fs.writeFileSync('src/views/GuardianView.tsx', code);
console.log("Success");
