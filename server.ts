import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  let ai: GoogleGenAI | null = null;

  // API Route
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.post('/api/analyze-diary', async (req, res) => {
    try {
      const hasApiKey = !!process.env.GEMINI_API_KEY;
      if (hasApiKey && !ai) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }

      const { records, themeMode, kidsTheme } = req.body;
      const recentRecords = records.filter((r: any) => Date.now() - r.date <= 7 * 24 * 60 * 60 * 1000);
      
      const payload = recentRecords.map((r: any) => ({
        date: new Date(r.date).toISOString(),
        intensidade_do_stress: r.intensity,
        humor: r.moodId,
        gatilhos: r.triggers,
        estrategia_usada: r.estrategiaUsadaString
      }));

      const patientDesc = themeMode === 'adult' ? "seu próprio diário" : "do diário da criança";
      
      let personaName = "uma assistente virtual chamada TEA SoundScapes IA";
      let personaTone = "Empático, encorajador, focado em autocuidado e regulação emocional.";
      if (themeMode === 'child') {
        if (kidsTheme === 'dino') {
           personaName = "um dinossauro super forte e amigável (o Guardião Rex)";
           personaTone = "Divertido, corajoso, protetor, elogiando a força da criança. Use emojis de dinossauro.";
        } else if (kidsTheme === 'space') {
           personaName = "um astronauta explorador do espaço intergalático";
           personaTone = "Aventureiro, calmo, falando sobre estrelas e missões espaciais. Use emojis do espaço.";
        } else if (kidsTheme === 'cars') {
           personaName = "um piloto campeão de corrida de carros";
           personaTone = "Animado, veloz, falando sobre pit stops para respirar e acelerar de novo. Use emojis de carros e bandeiras.";
        }
      }

      const promptUser = `Você é ${personaName}.
Embase-se nos dados fornecidos ${patientDesc} nos últimos 7 dias. Seu objetivo é ajudar, apoiar e encorajar quem está lendo o diário.
Comportamento da IA:
- Destinatário: A pessoa que está usando o App.
- Tom de Voz: ${personaTone}
- Proibição absoluta: Proibido dar diagnósticos clínicos ou parecer médico.
- Tamanho: O texto DEVE ser curto, no máximo 2 ou 3 frases.
Analise os dados e dê uma mensagem de apoio baseada no humor e intensidade de stress registrados. Dados: ${JSON.stringify(payload)}`;

      const promptPsychologist = `Você é uma assistente chamada TEA SoundScapes IA para o Terapeuta.
Embase-se nos dados fornecidos ${patientDesc} nos últimos 7 dias. 
Comportamento da IA:
- Destinatário: Psicólogo (No PDF)
- Tom de Voz: Analítico, clínico, objetivo, focado em correlações e frequência.
- Tamanho: Um parágrafo mais denso e técnico, destacando padrões, gatilhos recorrentes e horários de crise.
Analise os dados: ${JSON.stringify(payload)}`;

      const responseUserP = hasApiKey && ai ? ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptUser,
      }) : Promise.resolve({ text: themeMode === 'adult' ? 
          "Notei que os dias em ambientes muito agitados têm sido desafiadores ultimamente. Lembre-se que está tudo bem fazer pequenas pausas e usar suas estratégias de regulação. Você está indo muito bem!" : 
          kidsTheme === 'dino' ? "ROAARR! 🦖 Eu vi que os últimos dias foram um pouco barulhentos e difíceis. Mas você é forte como um T-Rex! Lembre-se de respirar fundo e apertar o botão de pânico quando precisar fugir para a caverna!" :
          kidsTheme === 'space' ? "Atenção, comandante! 👨‍🚀 Detectamos alguns meteoros de estresse no seu setor. Lembre-se de ativar seus escudos musicais e usar a respiração espacial. Você está indo muito bem na sua missão!" :
          "Acelera, campeão! 🏎️ Vi que a pista esteve meio esburacada recentemente. Não se esqueça de fazer aquele pit stop estratégico para respirar fundo antes de voltar para a corrida. Você é veloz!" 
      });

      const responsePsychologistP = hasApiKey && ai ? ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptPsychologist,
      }) : Promise.resolve({ text: "(MOCK) O paciente apresentou 5 crises nos últimos 7 dias, todas de intensidade severa (nível 100). O gatilho primário e local de risco mais frequente foi o uso do 'SOS Pânico automático' em ambientes não especificados, o que sugere uma sobrecarga sensorial significativa que o levou a recorrer à ferramenta de emergência repetidas vezes. A estratégia de regulação mais utilizada foi, coerentemente, o Botão de Pânico (5 vezes), seguido por Música (1 vez). Recomenda-se investigar os contextos exatos em que o SOS foi acionado para identificar os estressores ambientais subjacentes e diversificar o repertório de estratégias de enfrentamento preventivas." });

      const [resUser, resPsych] = await Promise.all([
        responseUserP.catch((e) => {
          console.error("AI User Error:", e);
          return { text: "Lembre-se de usar suas estratégias de regulação quando precisar. Você está indo muito bem!" };
        }), 
        responsePsychologistP.catch((e) => {
          console.error("AI Therapist Error:", e);
          return { text: "Não foi possível gerar a análise automatizada neste momento." };
        })
      ]);

      res.json({
        userInsight: resUser.text,
        therapistSummary: resPsych.text
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
