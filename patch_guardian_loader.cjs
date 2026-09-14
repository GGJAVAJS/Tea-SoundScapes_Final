const fs = require('fs');
let code = fs.readFileSync('src/views/GuardianView.tsx', 'utf8');
code = code.replace(
  /function Loader\(\) \{\s*const \{ progress \} = useProgress\(\);\s*return \(\s*<Html center>\s*<div className="flex flex-col items-center justify-center space-y-2">\s*<div className="w-12 h-12 border-4 border-accent-blue\/30 border-t-accent-blue rounded-full animate-spin" \/>\s*<span className="text-white\/70 text-xs font-mono font-medium">\{Math\.floor\(progress\)\}%<\/span>\s*<\/div>\s*<\/Html>\s*\);\s*\}/,
  `function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="w-12 h-12 border-4 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
      </div>
    </Html>
  );
}`
);
fs.writeFileSync('src/views/GuardianView.tsx', code);
