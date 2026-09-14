import re

with open('README.md', 'r') as f:
    content = f.read()

new_section = """
---

## 18. Evolução do Diário Terapêutico: Módulo de Análises & Inteligência Artificial

O aplicativo não deve apenas registrar dados, mas ser uma ferramenta preditiva. O Agente Antigravity DEVE evoluir a aba "Diário" de dados puramente descritivos (o que aconteceu) para **dados analíticos e preditivos** (por que aconteceu e como melhorar), alimentando o modelo da IA (Google Gemini API / `@google/genai`) com os dados do banco local SQLite.

### 18.1 Integração de IA (Modo Dual de System Prompts)
A inteligência artificial processará o histórico de humor do usuário com **DOIS comportamentos estritos e independentes**, dependendo do alvo final da leitura:

#### A) Visão do Usuário (In-App)
- **Onde renderiza:** Um "Card de Insight" ancorado no topo da aba de Análises (dentro do Diário).
- **System Prompt (Regra do Agente):** Empático, encorajador, não-clínico, focado estritamente em autocuidado e prevenção. É expressamente PROIBIDO fornecer diagnósticos médicos. O texto gerado deve ter o limite máximo de 2 linhas.
- **Exemplo de Retorno Exigido:** *"Notei que a 'Multidão' tem sido difícil essa semana. Está tudo bem fazer pausas. Que tal usar seu Som Refúgio hoje?"*
- **Design & Estilo (UI/UX):**
  - **Layout:** Card com bordas suaves (`border-radius: 16px` / `rounded-2xl`), utilizando efeito Glassmorphism suave (fundo translúcido `bg-white/5` ou `bg-white/10` dependendo do tema).
  - **Ícones:** Um ícone de Lâmpada (Luz/Insight) ou Coração, posicionado ao lado do texto.
  - **Cores por Tema:** 
    - *Adulto:* Borda com brilho sutil em Azul Celeste (`border-accent-blue/30`).
    - *Infantil (Dino):* Borda Laranja/Verde (`#ff5c00`).
    - *Infantil (Espaço):* Borda Roxo Cósmico com leve *glow*.
    - *Infantil (Carros):* Borda Amarelo Sinalização.
  - **Tipografia:** Fonte `Inter` ou `Plus Jakarta Sans`, peso médio, tamanho base legível (14px/16px), cor de texto suave e acolhedora (`text-gray-200`).

#### B) Visão do Terapeuta (Exportação PDF)
- **Onde renderiza:** Na função de "Exportar Relatório". O React Native deve gerar um documento usando bibliotecas como `expo-print` (HTML para PDF) e permitir o envio via `expo-sharing`.
- **System Prompt (Regra do Agente):** Analítico, clínico, puramente objetivo, focado em correlações matemáticas, gatilhos de estresse e frequência de ocorrências.
- **Estrutura no Documento:** O agente deve injetar uma seção obrigatória na PRIMEIRA página do PDF chamada **"Resumo Analítico da IA"**, formatada com um parágrafo denso, técnico e estruturado.
- **Exemplo de Retorno Exigido:** *"Padrão identificado: 80% dos eventos de humor baixo (escore 1-2) ocorreram pela manhã, estritamente atrelados ao gatilho 'Transporte e Barulho Urbano'."*
- **Design & Estilo (PDF):**
  - O layout do PDF deve ser estritamente monocromático ou tons de cinza clínicos para facilitar impressão.
  - O "Resumo Analítico da IA" deve estar dentro de uma caixa com borda sólida escura (`border: 1px solid #333`), fonte serifada ou sans-serif sóbria (Arial/Helvetica), espaçamento entrelinhas 1.5, sem nenhum elemento lúdico ou infantil, independentemente do tema da criança.

### 18.2 Privacidade e Contexto da IA
O Agente Antigravity DEVE extrair as entradas do `expo-sqlite` (ou MMKV) localmente, formatá-las como um objeto JSON simplificado e injetá-las no payload do prompt para a API do Gemini, garantindo que nenhum dado identitário (nome real, e-mail) seja enviado na string de contexto, apenas os registros das crises, horários, humor (1-5) e gatilhos ativados.
"""

with open('README.md', 'a') as f:
    f.write(new_section)

print("AI Analytics module section appended successfully.")
