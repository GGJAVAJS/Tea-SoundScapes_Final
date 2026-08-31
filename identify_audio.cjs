const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function identifyFile(fileName) {
  const filePath = path.join(__dirname, 'public', fileName);
  if (!fs.existsSync(filePath)) return;
  
  const fileBytes = fs.readFileSync(filePath);
  const base64Data = fileBytes.toString("base64");
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'audio/mp3'
              }
            },
            {
              text: "Ouça este áudio de ruído/ambiente e me diga em uma palavra ou frase curta qual é o som principal. Ex: Chuva, Vento, Fogo/Lareira, Pássaros, Água/Rio, Ruído Branco/Rosa/Marrom."
            }
          ]
        }
      ]
    });
    console.log(`${fileName}: ${response.text}`);
  } catch(e) {
    console.log(`${fileName}: error`, e.message);
  }
}

async function run() {
  const files = fs.readdirSync(path.join(__dirname, 'public')).filter(f => f.endsWith('.mp3'));
  for (const f of files) {
    await identifyFile(f);
  }
}

run();
