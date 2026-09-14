const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setIsOnboarding\(false\);\s*\}\}\s*\/>;/,
  `if (data.parentalPin) {
        setParentalPin(data.parentalPin);
      }
      setIsOnboarding(false);
    }} />;`
);

fs.writeFileSync('src/App.tsx', code);
