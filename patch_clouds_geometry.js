import fs from 'fs';

let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf-8');

// Replace planeGeometry with circleGeometry for softer edges, 
// or keep planes but they are planes without texture, so they will be sharp rectangles.
// Let's change them to circle geometries to look like soft flat clouds.
code = code.replace(
  /<planeGeometry args=\\{\\[c.scale \* 2, c.scale\\]\\} \/>/,
  `<circleGeometry args={[c.scale, 32]} />`
);

fs.writeFileSync('src/views/PanicOverlay.tsx', code);
console.log("Success");
