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
  app.post('/api/analyze-diary', async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
      }
      if (!ai) {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }

      const { records } = req.body;
      const recentRecords = records.filter((r: any) => Date.now() - r.date <= 7 * 24 * 60 * 60 * 1000);
      
      const payload = recentRecords.map((r: any) => ({
        date: new Date(r.date).toISOString(),
        intensidade_do_stress: r.intensity,
        humor: r.moodId,
        gatilhos: r.triggers,
        estrategia_usada: r.estrategiaUsadaString
      }));

      const promptUser = `
Você é uma assistente chamada TEA SoundScapes IA.
Embase-se nos dados fornecidos do diário do paciente nos últimos 7 dias. Seu objetivo é ajudar e encorajar.
Comportamento da IA:
- Destinatário: Usuário (No App)
- Tom de Voz: Empático, encorajador, não clínico, focado em autocuidado.
- Proibição absoluta: Proibido dar diagnósticos.
- Tamanho: O texto DEVE ser curto, no máximo 2 linhas.
Analise os dados e dê um insight reconfortante. Dados: ${JSON.stringify(payload)}`;

      const promptPsychologist = `
Você é uma assistente chamada TEA SoundScapes IA para o Terapeuta.
Embase-se nos dados fornecidos do diário do paciente nos últimos 7 dias. 
Comportamento da IA:
- Destinatário: Psicólogo (No PDF)
- Tom de Voz: Analítico, clínico, objetivo, focado em correlações e frequência.
- Tamanho: Um parágrafo mais denso e técnico, destacando padrões, gatilhos recorrentes e horários de crise.
Analise os dados: ${JSON.stringify(payload)}`;

      const responseUserP = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptUser,
      });

      const responsePsychologistP = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptPsychologist,
      });

      const [resUser, resPsych] = await Promise.all([responseUserP, responsePsychologistP]);

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
