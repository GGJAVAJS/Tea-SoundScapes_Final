import re

with open('README.md', 'r') as f:
    content = f.read()

new_section = """
---

## 13. Fluxo de Autenticação e Criação de Conta (Onboarding)

O Agente Antigravity DEVE dominar estritamente o fluxo de entrada do aplicativo, pois ele define as barreiras de layout entre Adulto e Infantil.

### 13.1 Tela de Login (`AuthView`)
- **Estilo & Fundo:** É a porta de entrada neutra do aplicativo. Possui fundo escuro puro (`bg-[#060b13]`), sem decorações infantis, apenas dois gradientes radiais borrados ao fundo (`bg-accent-blue/10` blur-100px no top-left, e `bg-accent-purple/10` blur-80px no bottom-right).
- **Tipografia:** Fonte `Poppins` nos cabeçalhos (`TEA SoundScapes`) e `Inter` ou `Plus Jakarta Sans` no corpo.
- **Ação Nativa:** Inputs textuais escuros (glass card com borda `border-white/10`). 
- **Oversight:** "Criar conta (Boas-vindas)" deve levar o usuário para o Onboarding.

### 13.2 Fluxo de Onboarding (Criação de Conta e Anamnese)
A criação de conta possui múltiplas etapas guiadas e a decisão principal molda toda a UI do app.
- **Background Fixo:** Fundo escuro absoluto `bg-[#060b13]` para as etapas gerais.
- **Tipografia:** `Poppins` para títulos.
- **A Escolha Crítica (Etapa 3 - Perfil):** O usuário escolhe entre **Modo Adulto** ou **Modo Infantil**. 
  - **Adulto:** Foca em minimalismo e autonomia (estilo Slate/Azul Celeste).
  - **Infantil:** A cor de destaque primária do botão e textos imediatamente migra do Azul Celeste para o Laranja Quente (`#ff5c00`) ou gradiente.
- **A Escolha Temática (Etapa 7 - Apenas Modo Infantil):**
  - O app pergunta: "Qual é o seu mundo favorito?".
  - A interface exibe 3 cards grandes: 
    1. **Dinossauros (🦖):** Borda verde/laranja (`#ff5c00`).
    2. **Espaço Sideral (🚀):** Borda Indigo/Roxa (`#6366f1`).
    3. **Carros (🚗):** Borda Vermelha (`#ef4444`).
- **Pino de Segurança (PIN Parental - Apenas Modo Infantil):** A etapa final obriga a criação de um PIN de 4 dígitos para impedir que a criança acesse configurações ou o Diário Analítico sem o pai. O agente deve garantir que o Numpad do RN esteja acessível.

---

## 14. Detalhamento da Aba Perfil (`ProfileView`) e Telas EU

A aba "Perfil" ou "Eu" é a área de configurações pessoais, mas no **Modo Infantil** ela não é um formulário sem graça, mas sim um menu imersivo, lúdico e isolado pelo PIN Parental.

### 14.1 Backgrounds Dinâmicos (Modo Infantil - Tela EU)
As configurações da criança sobrepõem os cenários nativos através de imagens animadas e backgrounds estritos (atrás dos *glass cards* de configuração):
- **Tema Espaço Sideral:**
  - Imagem: `naveet.png` (Nave espacial sendo pilotada).
  - Posição: Deve ser ancorada no topo à direita, flutuando (usando `useSharedValue` em Y: -10 a 10).
- **Tema Dinossauro (`DinoProfileBackground`):**
  - Background: Gradiente linear de Marrom-Terra `rgba(137, 92, 7, 0.5)` para Verde Musgo `rgba(42, 72, 6, 1)`.
  - Nuvens e Fósseis: `cloud.png` no topo do céu, `fossil.png` e `fossil_rex.png` em posições centrais flutuando devagar.
  - Imagem Principal: `dino_fofo.png` posicionado estritamente em `bottom-24` e `left-[-10px]`, pulando/flutuando suavemente no eixo Y.
- **Tema Carros:**
  - Background: Usa os elementos SVGs importados de fundo `race-lights.png` (luzes de largada), `speed-meter.png` e `podium-stand.png` sobrepostos com opacidade de 30% em `absolute inset-0` e translação lenta.
- **Cores dos Cartões (`ProfileView`):** No modo infantil Dinossauro, em vez do fundo de vidro transparente `rgba(255,255,255,0.05)`, os *cards* de configuração (Editar Nome, Adicionar Contato) assumem uma base opaca forte: `#553100` (Marrom). O Agente Antigravity deve rastrear essas trocas lógicas no `StyleSheet`.

"""

with open('README.md', 'a') as f:
    f.write(new_section)

print("Auth, Onboarding, and Profile (EU) sections appended.")
