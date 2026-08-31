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
      model: 'gemini-1.5-flash',
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
              text: "Classify this audio. Listen to it. Is it Rain, Wind, Fire, Birds, Water, Brown noise, White noise, or Pink noise? Output ONLY ONE WORD representing the sound."
            }
          ]
        }
      ]
    });
    console.log(`${fileName}: ${response.text.trim()}`);
  } catch(e) {
    console.log(`${fileName}: error`, e.message);
  }
}

async function run() {
  const files = fs.readdirSync(path.join(__dirname, 'public')).filter(f => f.endsWith('.mp3'));
  for (let i = 0; i < files.length; i++) {
    await identifyFile(files[i]);
    await new Promise(r => setTimeout(r, 4000));
  }
}

run();
