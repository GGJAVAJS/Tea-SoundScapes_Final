const fs = require('fs');
let code = fs.readFileSync('src/views/OnboardingView.tsx', 'utf8');

code = code.replace(
  '<span className="text-sm text-gray-400">Após a utilização do SOS Pânico, a criança vê o termômetro lúdico dos temas para apontar como se sente.</span>',
  '<span className="text-sm text-gray-400">Após a utilização do SOS Pânico, a criança vê o termômetro lúdico dos temas para apontar como se sente. A tela de avaliação só aparecerá após a utilização do SOS Pânico.</span>'
);

fs.writeFileSync('src/views/OnboardingView.tsx', code);
console.log('Success Onboarding 2');
