const fs = require('fs');

// --- Patch PanicOverlay (Pterodactyl) ---
let panicCode = fs.readFileSync('/app/applet/src/views/PanicOverlay.tsx', 'utf8');

const pteroRegex = /<group ref=\{group\} position=\{\[0, 40, 0\]\}>[\s\S]*?<\/group>/;
const newPteroGroup = `<group ref={group} position={[0, 40, 0]}>
      <PerspectiveCamera makeDefault position={[0, -1, 7]} rotation={[0.1, 0, 0]} fov={75} />
      <primitive object={scene} scale={2} rotation={[0, Math.PI, 0]} />
    </group>`;
panicCode = panicCode.replace(pteroRegex, newPteroGroup);

fs.writeFileSync('/app/applet/src/views/PanicOverlay.tsx', panicCode);

// --- Patch GuardianView (T-Rex) ---
let guardianCode = fs.readFileSync('/app/applet/src/views/GuardianView.tsx', 'utf8');

const camRegex = /<PerspectiveCamera makeDefault position=\{\[0, -4, -8\]\} rotation=\{\[0\.4, 0, 0\]\} fov=\{70\} \/>/;
guardianCode = guardianCode.replace(camRegex, '<PerspectiveCamera makeDefault position={[0, -4.5, -9]} rotation={[0.15, 0, 0]} fov={75} />');

fs.writeFileSync('/app/applet/src/views/GuardianView.tsx', guardianCode);

console.log("Patched successfully");
