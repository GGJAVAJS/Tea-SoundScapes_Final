const code = require('fs').readFileSync('src/views/ProfileView.tsx', 'utf-8');
console.log(code.includes("localStorage.removeItem(\`onboardingData_\${email}\`);"));
