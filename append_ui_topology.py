import re

with open('README.md', 'r') as f:
    content = f.read()

# Make sure AI Analytics mentions both modes
content = content.replace(
    'A inteligência artificial processará o histórico de humor do usuário',
    'A inteligência artificial processará o histórico de humor do usuário (Lembrando: Este Módulo de Análise e IA está presente TANTO NO MODO ADULTO QUANTO NO MODO INFANTIL)'
)

new_content = """
---

## 19. Topologia e Layout Estrito das Telas (UI/UX)

Para que o Agente Antigravity não distorça o design original, abaixo está o raio-x exato do que compõe cada uma das 5 abas principais e seus recursos exclusivos.

### 19.1 Tela INÍCIO (Home / Mixer Principal)
A tela de entrada principal do aplicativo, focada na mesa de som.
- **Botões de Emergência (Globais):** 
  - **Botão "Meu Refúgio":** Aciona imediatamente o som seguro configurado. 
  - **Botão "SOS Pânico":** Botão vermelho/destaque que sobrepõe a interface inteira e leva à tela de exercícios respiratórios. Ambos ficam visíveis de forma proeminente na Home.
- **Mixer Principal (Mesa de Som):** Lista de trilhas de áudio (Chuva, Fogo, Ruído Rosa, etc).
  - **Favoritos (Ambos os Modos):** Os usuários podem salvar a combinação atual de volumes e áudios ligados clicando no ícone de Coração/Favoritar.
  - **Botão de 3 Pontinhos (MIXER AVANÇADO - EXCLUSIVO ADULTO):** No Modo Adulto, cada trilha possui um ícone de 3 pontinhos. Ao clicar, abre um painel de equalização complexa (`Volume`, `Graves`, `Médios`, `Agudos`).
  - **REGRA DE ISOLAMENTO (CRÍTICA):** No Modo Infantil, o botão de 3 pontinhos DEVE DESAPARECER completamente (desmontado do DOM/React Tree). A criança só pode ligar/desligar o som, sem acesso a frequências e equalizadores, para evitar distorções sensoriais.
- **Player Interno:** Onde os Shaders WebGL rodam no Modo Infantil conforme a música dominante.

### 19.2 Tela DIÁRIO (DiaryView)
Dividida em duas sub-abas no topo:
- **Aba "Como você está agora?":** O rastreador de humor. No Modo Infantil possui os avatares (Espaço, Dino) ou painel analógico (Carros). No Modo Adulto, utiliza botões minimalistas ou sliders sóbrios.
- **Aba "Análises" (AMBOS OS MODOS):** Onde os gráficos de barras/linhas são renderizados acompanhados do **Card de Insight da Inteligência Artificial** ancorado no topo.

### 19.3 Tela SOCIAL (Comunidade)
- **Feed:** Uma lista de rolagem vertical (FlatList) com os *Soundscapes* (Mixes) compartilhados por outros usuários.
- **Player de Rodapé:** Quando o usuário clica em um mix da comunidade, o player interno sobe no rodapé (com o equalizador dinâmico e o glow/ripple effect pulsando em 60fps, já documentado na seção de animações).

### 19.4 Tela GUARDIÃO (Rede de Apoio)
- **Modo Adulto:** Interface limpa, lista de contatos de emergência (Cards minimalistas), botão rápido para enviar SMS/WhatsApp de socorro.
- **Modo Infantil:** Esconde configurações complexas. Foca no monitoramento. Exibe o Semáforo Inteligente (Carros), ou o Fundo de Névoa (Dino), ou a Nebulosa (Espaço).

### 19.5 Tela EU (ProfileView / Configurações)
O centro de gerenciamento (Logoff, Trocar Conta, Editar Perfil).
- **Modo Adulto:** Lista de configurações em "Glass Cards" escuros, fundo limpo.
- **Modo Infantil:** Bloqueado pelo PIN Parental de 4 dígitos. Sobreposto com as imagens flutuantes estritas documentadas anteriormente (Nave, Dino Fofo, Pódio). O Logout DEVE forçar a limpeza absoluta do estado global (Zustand/Contexto) para evitar vazamento do tema infantil caso o pai logue em seguida.

---

## 20. Paleta de Cores Temáticas Estritas (Hexadecimais)

O Antigravity DEVE respeitar estritamente estas paletas (utilizando Tailwind classes ou `StyleSheet`), sem inventar cores genéricas.

- **MODO ADULTO (Padrão/Sóbrio):**
  - **Fundo Base:** `#060b13` (Preto/Azul muito profundo, Slate 950).
  - **Cor de Destaque (Accent):** Azul Celeste / Sky Blue (`#38bdf8` ou Tailwind `sky-400`). Usado no botão Refúgio, sliders e botões ativos.
  - **Painéis/Cards:** Branco translúcido (`rgba(255, 255, 255, 0.05)` a `0.1`).

- **MODO INFANTIL - TEMA DINOSSAUROS:**
  - **Cores Primárias:** Verde Musgo (`#2a4806`) e Laranja Quente (`#ff5c00`).
  - **Painéis Opacos (Eu/Perfil):** Marrom Terra (`#553100`).
  - **Bordas e Efeitos:** Brilhos e contornos puxando para o verde selva e laranja âmbar.

- **MODO INFANTIL - TEMA ESPAÇO SIDERAL:**
  - **Cores Primárias:** Roxo Cósmico / Índigo (`#6366f1` a `#a855f7`).
  - **Painéis:** Fundos profundamente escuros (espaço) com bordas de neon roxo e efeitos *Glow* (`shadow-[0_0_20px_rgba(99,102,241,0.4)]`).
  - **Botões:** Indigo vibrante.

- **MODO INFANTIL - TEMA CARROS:**
  - **Cores Primárias:** Amarelo Sinalização / Neon (`#eab308`) e Vermelho Intenso (`#ef4444`).
  - **Painéis:** Cinza Asfalto / Preto Brilhante.
  - **Elementos (Semáforo/HUD):** Utiliza cores elétricas fortes (Verde Neon `#22c55e`, Laranja Fluorescente).

"""

with open('README.md', 'a') as f:
    f.write(new_content)

print("UI topology and strict color palettes appended successfully.")
