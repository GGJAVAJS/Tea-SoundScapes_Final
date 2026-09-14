const fs = require('fs');
let code = fs.readFileSync('src/views/PanicOverlay.tsx', 'utf8');
code = code.replace(
  /function Loader\(\) \{\s*const \{ progress \} = useProgress\(\);\s*return \(\s*<Html center>\s*<div className="flex flex-col items-center justify-center space-y-2">\s*<div className="w-8 h-8 border-2 border-accent-blue\/30 border-t-accent-blue rounded-full animate-spin" \/>\s*<\/div>\s*<\/Html>\s*\);\s*\}/,
  `function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
      </div>
    </Html>
  );
}`
);
fs.writeFileSync('src/views/PanicOverlay.tsx', code);
