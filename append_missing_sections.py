import os

with open('README.md', 'r') as f:
    content = f.read()

append_text = """
---

## 12. Detalhamento Faltante: Aba Guardião e Animações Contextuais

Abaixo estão as diretrizes arquiteturais para recursos visuais avançados que DEVEM ser portados para o React Native, abordando telas essenciais da navegação e efeitos customizados.

### 12.1 A Tela Guardião (`GuardianView.tsx`)
A aba "Guardião" (Rede de Apoio e Disparo de Emergência) é a **quinta aba principal** do aplicativo (junto com Home, Diário, Social e Perfil).
Ela possui regras estritas baseadas no Modo Atual (Adulto vs Infantil):
- **Modo Adulto:** Interface extremamente "clean", escura (Slate 950), orientada a acessibilidade para acionamento rápido de mensagens de ajuda e gerenciamento de contatos.
- **Modo Infantil:** A interface é coberta por animações imersivas dependendo do tema:
  - **Tema Espaço Sideral:** `SpaceBloomShader` como fundo imersivo.
  - **Tema Dinossauro:** `MistyLakeShader` como fundo ambiental.
  - **Tema Carros:** A tela Guardião possui assets em translação e efeitos visuais contínuos (background dinâmico sem WebGL, usando translações `translateX` e `translateY` de pistas ou SVGs/Imagens). No React Native, **utilize `react-native-reanimated` (useSharedValue e withRepeat)** para manter a pista e o cenário de fundo do tema carros em movimento contínuo (loop infinito de scroll visual) sem consumir memória pesada.

### 12.2 Tela SOS Pânico (`PanicOverlay.tsx`) - Animações do Tema Carros
Na tela de emergência do Modo Infantil, a criança é guiada por exercícios respiratórios ("Inspire... Segure... Expire...").
- **Tema Carros:** Além dos shaders nos outros temas, o Tema Carros possui **Animações Customizadas de HUD/Velocímetro** para guiar a respiração (ex: acelerar luzes ou mover o ponteiro conforme ela inspira e expira).
- **Diretriz de Migração:** O agente Antigravity DEVE preservar essa lógica. Substitua as animações Web (`framer-motion`) das peças mecânicas do carro por `useAnimatedStyle` no React Native. Amarre a progressão do estado `phase` do React (Inspire/Expire) diretamente à rotação do ponteiro (usando `withTiming`) e à opacidade das luzes de sinalização.

### 12.3 Animações do Player Interno (Aba Social / Comunidade)
A Aba Social (`CommunityView`) possui um *Player Interno* exibido no rodapé ao reproduzir um Mixer de Áudio compartilhado por outro usuário.
- **Equalizador Dinâmico:** Quando ativo, a UI pulsa barras de equalizador (coloridas de acordo com a "Cor de Destaque" do mix selecionado).
- **Glow Ativo:** O ícone do áudio em reprodução pisca e expande ondas concêntricas (efeito *ripple*). 
- **Diretriz de Migração:** A lógica de estado que aciona as barras do equalizador e os anéis concêntricos foi feita em Framer Motion na Web. No React Native, você DEVE reconstruir isso acionando múltiplos *SharedValues* independentes com `withRepeat(withSequence(...), -1, true)` para garantir que o player pulse suavemente em 60fps na base da tela sem travar a navegação pela lista da comunidade.

"""

with open('README.md', 'a') as f:
    f.write(append_text)

print("Section 12 (Guardian, Cars Panic, Social Player animations) appended successfully.")
