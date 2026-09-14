const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf-8');
console.log(code.includes('O TEA SoundScapes é um ecossistema digital criado para auxiliar na regulação sensorial'));
