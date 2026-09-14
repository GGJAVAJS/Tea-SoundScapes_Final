const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
  'const { records } = req.body;',
  'const { records, themeMode } = req.body;'
);
const promptUserText = `const patientDesc = themeMode === 'adult' ? "seu próprio diário" : "do diário do paciente";
      const promptUser = \`Você é uma assistente chamada TEA SoundScapes IA.
Embase-se nos dados fornecidos \${patientDesc} nos últimos 7 dias. Seu objetivo é ajudar e encorajar.
Comportamento da IA:
- Destinatário: Usuário (No App)
- Tom de Voz: Empático, encorajador, não clínico, focado em autocuidado.
- Proibição absoluta: Proibido dar diagnósticos.
- Tamanho: O texto DEVE ser curto, no máximo 2 linhas.
Analise os dados e dê um insight reconfortante. Dados: \${JSON.stringify(payload)}\`;`;

code = code.replace(
  /const promptUser = `Você é uma assistente chamada TEA SoundScapes IA\.[\s\S]*?Analise os dados e dê um insight reconfortante\. Dados: \$\{JSON\.stringify\(payload\)\}`;/,
  promptUserText
);

const promptPsyText = `const promptPsychologist = \`Você é uma assistente chamada TEA SoundScapes IA para o Terapeuta.
Embase-se nos dados fornecidos \${patientDesc} nos últimos 7 dias. 
Comportamento da IA:
- Destinatário: Psicólogo (No PDF)
- Tom de Voz: Analítico, clínico, objetivo, focado em correlações e frequência.
- Tamanho: Um parágrafo mais denso e técnico, destacando padrões, gatilhos recorrentes e horários de crise.
Analise os dados: \${JSON.stringify(payload)}\`;`;

code = code.replace(
  /const promptPsychologist = `Você é uma assistente chamada TEA SoundScapes IA para o Terapeuta\.[\s\S]*?Analise os dados: \$\{JSON\.stringify\(payload\)\}`;/,
  promptPsyText
);

fs.writeFileSync('server.ts', code);
