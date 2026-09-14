const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const target = `];

const FloatingSpaceBackground = React.memo(() => {`;

const logic = `];

function getIconComponentForName(title: string) {
  const t = title.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
  if (t.includes('cabeca') || t.includes('cerebro') || t.includes('mente') || t.includes('pensamento') || t.includes('acalmar')) return Brain;
  if (t.includes('foco') || t.includes('estudar') || t.includes('trabalho') || t.includes('produtividade')) return Grid3x3;
  if (t.includes('dormir') || t.includes('sono') || t.includes('noite') || t.includes('descanso')) return Moon;
  if (t.includes('relaxar') || t.includes('calma') || t.includes('paz') || t.includes('zen') || t.includes('vento')) return Wind;
  if (t.includes('chuva') || t.includes('agua') || t.includes('tempestade') || t.includes('mar')) return Droplets;
  if (t.includes('natureza') || t.includes('floresta') || t.includes('arvore') || t.includes('passaros')) return Trees;
  if (t.includes('viagem') || t.includes('onibus') || t.includes('carro') || t.includes('aviao')) return Bus;
  if (t.includes('bebe') || t.includes('crianca') || t.includes('infantil')) return Baby;
  if (t.includes('leitura') || t.includes('livro') || t.includes('estudo')) return BookOpen;
  if (t.includes('fogo') || t.includes('lareira')) return Flame;
  return Activity;
}

const FloatingSpaceBackground = React.memo(() => {`;

if (code.includes(target)) {
    code = code.replace(target, logic);
    console.log("function injected");
} else {
    console.log("target not found");
}

fs.writeFileSync('src/views/HomeView.tsx', code);
