# 🎧 TEA SoundScapes

Aplicação Web Progressiva (PWA) interativa desenvolvida para auxiliar na autorregulação sensorial, monitoramento acústico e acompanhamento emocional de crianças e adultos no espectro autista (TEA).

---

## ✨ Funcionalidades Principais

* **Modo Infantil & Seletor de Mundos:** Interface lúdica com troca dinâmica entre os temas **Espaço**, **Dinossauros** e **Carros**[cite: 9], adaptando cores, elementos visuais e termômetros de humor[cite: 9].
* **Modo Adulto:** Interface minimalista e direta, focada em controle acústico rápido e acompanhamento de métricas.
* **Mixer Sonoro & Equalizador:** Reprodução simultânea de ruídos terapêuticos e sons da natureza com equalizador de 3 bandas (Graves, Médios e Agudos).
* **Guardião (Decibelímetro & 3D):** Monitoramento de ruído ambiente em tempo real com cenário 3D interativo (`WebGL`) e gatilho automático de emergência ao atingir **75dB**.
* **SOS Pânico:** Acesso rápido centralizado para momentos de crise sensorial, com opção imediata de notificação de familiares e animações imersivas calmantes.
* **Diário & Relatório com IA:** Registro diário de humor e crises integrado à API do **Google Gemini**, gerando resumos analíticos exportáveis em PDF para apoio terapêutico.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** React, TypeScript, Vite (`vite-plugin-pwa`), Tailwind CSS, Framer Motion
* **Gráficos 3D:** Three.js, `@react-three/fiber`, `@react-three/drei`
* **Áudio & Sensores:** HTML5 Web Audio API & MediaStream API
* **Armazenamento Local:** IndexedDB & LocalStorage[cite: 9]
* **Inteligência Artificial:** Google Gemini API

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```
