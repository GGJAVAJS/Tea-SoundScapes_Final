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
      model: 'gemini-1.5-pro',
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
              text: "You are a multimodal model capable of processing audio. Listen to the provided audio clip and identify the main sound in it. Is it Rain, Wind, Fire, Birds, Water, Brown noise, White noise, or Pink noise? Only reply with the primary sound type."
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
    // Sleep to avoid rate limits
    await new Promise(r => setTimeout(r, 20000));
  }
}

run();
