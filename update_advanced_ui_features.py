import re

with open('README.md', 'r') as f:
    content = f.read()

# 1. Update Section 7.2 to add structural icon preservation rule
icon_replacement = """### 7.2 Ícones de Vetor (Lucide)
O sistema web usa amplamente o pacote `lucide-react`. 
- **Contextos Adulto/Sistema:** `User`, `Shield`, `Bell`, `Info`, `Lock`, `Settings`, `LogOut`.
- **Controles do Mixer (Audio) e UI Interna:** `Volume2`, `Play`, `Pause`, `Activity`, `MoreVertical` (3 pontinhos).
- **Player Interno e Ações:** `Heart` (Favoritar), `Repeat` (Looping), `Share2` (Compartilhar), `Download`.
- **Rastreadores:** `Moon` (Sono), `Heart` (Humor/Sentimento), `Book` (Diário).
- **Rede de Apoio:** `Phone`, `MapPin` (Localização).

> **REGRA DE PRESERVAÇÃO ESTRUTURAL:** Os ícones de interface não temáticos (Play, Pause, Coração, Lixeira, Configurações de som, Botão de 3 pontinhos) DEVEM ser preservados como vetores Lucide. Não tente substituí-los por PNGs ou removê-los do código. Eles são vitais para a usabilidade tanto no modo Adulto quanto no Infantil.
> **Comando de Migração de Ícone:**
> Substituir todo o pacote para `lucide-react-native`.
> Adicionar tamanho e cor via propriedades explícitas, já que as classes Tailwind não aplicarão regras SVG (ex: `<Mic size={24} color="#38bdf8" />`)."""

content = re.sub(r'### 7\.2 Ícones de Vetor \(Lucide\).*?(?=\n\n---)', icon_replacement, content, flags=re.DOTALL)


# 2. Update Section 10 to include Semantic Icon Mapping
audio_rules_replacement = """## 10. Regras Lógicas de Importação de Áudio e Criação de Mixers

**A. Importação de Áudio Personalizado (Mixer Principal)**
- **Web Atual:** O usuário clica em "Importar Áudio", o app aciona um input invisível `<input type="file" accept="audio/*">`. O áudio selecionado ganha o prefixo `imported-<timestamp>` e seu `URL.createObjectURL` é carregado pelo Audio Engine, enquanto a interface exibe o `<MathematicalVisualizer>` para preencher a tela com o áudio desconhecido.
- **Migração (React Native):** O agente DEVE remover a tag de input HTML. Ao clicar em Importar Áudio, o sistema acionará obrigatoriamente a biblioteca nativa **`expo-document-picker`** (`getDocumentAsync({ type: 'audio/*' })`). A URI local será salva no estado e montada num player do pacote **`expo-av`**.

**B. Publicação de um Mixer Personalizado**
- **Web Atual:** Utiliza o componente `<PublishMixOverlay>`. Ele captura o estado atual de `volumes`, sons ativos, configurações de Equalizador (Bass, Mid, Treble) definidos pelo usuário, pede um Título, uma Categoria, uma Palavra-chave/Cor e salva no cache (`localStorage` via chave `published_community_mixes`).
- **Migração (React Native):** O overlay de publicação deve ser um `Modal` nativo sobreposto. Os dados capturados do painel devem ser preservados e enviados para o **AsyncStorage** (para uso local provisório), permitindo que os mixes customizados surjam imeditamente no fluxo da Aba Social (`CommunityView`), mantendo toda a arquitetura de equalização associada.

**C. Sincronização Semântica de Ícones (Palavras-chave)**
- Ao importar um áudio local ou publicar um mixer na Comunidade, o aplicativo possui uma lógica estrita de atribuição de ícone baseada em **Palavras-Chave (Keywords) presentes no título** digitado pelo usuário.
- O Agente Antigravity DEVE replicar este mapeamento (Regex/Includes) usando os ícones do `lucide-react-native` ao renderizar as listas de áudio:
  - Se o título contiver "mente", "foco" ou "estudo" -> Ícone `Brain`
  - Se o título contiver "chuva", "tempestade" ou "rain" -> Ícone `CloudRain`
  - Se o título contiver "fogo", "lareira" ou "fire" -> Ícone `Flame`
  - Se o título contiver "vento", "ar" ou "wind" -> Ícone `Wind`
  - Se o título contiver "mar", "oceano" ou "onda" -> Ícone `Waves`
  - Se não houver correspondência, usa o ícone padrão -> Ícone `Music`"""

content = re.sub(r'## 10\. Regras Lógicas de Importação de Áudio e Criação de Mixers.*?(?=\n\n### ARQUIVOS COMPLEMENTARES)', audio_rules_replacement, content, flags=re.DOTALL)


# 3. Update Section 17.1 to include Internal Player Buttons
home_replacement = """### 17.1 Tela INÍCIO (Home / Mixer Principal)
A tela de entrada principal do aplicativo, focada na mesa de som.
- **Botões de Emergência (Globais):** 
  - **Botão "Meu Refúgio":** Aciona imediatamente o som seguro configurado. 
  - **Botão "SOS Pânico":** Botão vermelho/destaque que sobrepõe a interface inteira e leva à tela de exercícios respiratórios. Ambos ficam visíveis de forma proeminente na Home.
- **Mixer Principal (Mesa de Som):** Lista de trilhas de áudio (Chuva, Fogo, Ruído Rosa, etc).
  - **Botão de 3 Pontinhos (MIXER AVANÇADO - EXCLUSIVO ADULTO):** No Modo Adulto, cada trilha possui um ícone de 3 pontinhos vertical (`MoreVertical`). Ao clicar, um painel deslizante ou modal expansivo é aberto revelando 3 barras de deslizamento finas e precisas: **Graves (Bass), Médios (Mid) e Agudos (Treble)**, permitindo ajustes acústicos finos além do volume geral.
  - **REGRA DE ISOLAMENTO (CRÍTICA):** No Modo Infantil, o botão de 3 pontinhos DEVE DESAPARECER completamente (desmontado do DOM/React Tree). A criança só pode ligar/desligar o som, sem acesso a frequências e equalizadores, para evitar distorções sensoriais.
- **Player Interno (Mesa Principal):** Renderizado no topo ou centro ao dar Play em áudios ativos.
  - **Botões do Player Principal:** Exibe controles de "Favoritar" (Salva o combo atual de áudios no BD), "Play/Pause" central, "Parar Tudo" (Stop) e "Salvar Refúgio".
  - **Background do Player:** Onde os Shaders WebGL rodam no Modo Infantil conforme a música dominante."""

content = re.sub(r'### 17\.1 Tela INÍCIO \(Home / Mixer Principal\).*?(?=\n\n### 17\.2)', home_replacement, content, flags=re.DOTALL)


# 4. Update Section 18.3 to include Social Internal Player Buttons
social_replacement = """### 18.3 Tela SOCIAL (Comunidade)
- **Botão Publicar:** Existe EXCLUSIVAMENTE no Modo Adulto. A criança não tem permissão para publicar áudios.
- **Feed:** Uma lista de rolagem vertical (FlatList) com os *Soundscapes* (Mixes) compartilhados por outros usuários. Utiliza a "Lógica Semântica de Ícones" descrita na seção 10.
- **Player Interno de Rodapé (Comunidade):** Quando o usuário clica em um mix da comunidade, o player interno sobe no rodapé.
  - **Botões e Ações:** Este player específico exibe botões de "Play/Pause", um botão circular de "Loop" (`Repeat` icon) para tocar repetidamente o mix da comunidade, e o botão de "Coração" (`Heart`) que, ao ser clicado, salva o mix de terceiros na biblioteca local do usuário (Favorites).
  - **Animações (Glow/Equalizador):** Como já documentado, possui o equalizador dinâmico com barras pulsantes de acordo com o ritmo, e o ícone central pulsa anéis concêntricos suaves em 60fps usando animações reativas."""

content = re.sub(r'### 18\.3 Tela SOCIAL \(Comunidade\).*?(?=\n\n### 18\.4)', social_replacement, content, flags=re.DOTALL)

with open('README.md', 'w') as f:
    f.write(content)

print("Advanced UI, Icons, Player Buttons, and Semantic mapping added.")
