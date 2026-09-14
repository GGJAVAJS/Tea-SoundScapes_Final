import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

code = code.replace(
  /<planeGeometry args=\\{\\[c.scale \* 2, c.scale\\]\\} \/>/g,
  `<circleGeometry args={[c.scale, 32]} />`
);
code = code.replace(
  '<planeGeometry args={[c.scale * 2, c.scale]} />',
  '<circleGeometry args={[c.scale, 32]} />'
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Success");
