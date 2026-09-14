with open('README.md', 'r') as f:
    content = f.read()

append_text = """
---

## 9. Posicionamento Estrito de Assets (Pixel-Perfect)

**ATENÇÃO:** O usuário exige que as posições originais das imagens flutuantes (Temas Infantis) sejam preservadas com 100% de fidelidade. Você NÃO tem permissão para alterar as coordenadas visuais na conversão para React Native.

- No Web, usamos as classes Tailwind utilitárias (ex: `top-[2%] left-[10%] w-36`).
- No React Native, você deve criar um `StyleSheet` (ou usar NativeWind) que mapeie exatamente esses valores matemáticos em posições absolutas baseadas na tela (`Dimensions.get('window')` ou porcentagens de flex).

**Exemplo - Espaço Sideral (`FloatingSpaceBackground.tsx`):**
- **Planet Big:** `bottom: -10%`, `right: -30%`, largura `w-[32rem]`
- **Planet 2 (Ringed):** `top: 2%`, `left: 10%`, largura `w-36`
- **Meteor:** `top: 10%`, `left: -5%`, largura `w-16`
- **Moon:** `top: 35%`, `right: 15%`, largura `w-16`
- **Planet 1:** `bottom: 10%`, `left: -10%`, largura `w-40`
- **Satellite:** `top: 12%`, `right: 5%`, largura `w-24`
- **Rocket:** `bottom: 25%`, `right: 5%`, largura `w-28`
- **Asteroid 1:** `top: 55%`, `left: 8%`, largura `w-20`
- **Asteroid 2:** `bottom: 15%`, `left: 30%`, largura `w-14`

**Exemplo - Dinossauros (`FloatingDinoBackground.tsx`):**
- **Fóssil:** `top: 24px`, `left: 16px` (w-24)
- **T-Rex (dino_alto):** `bottom: 16px`, `left: 20%` (w-64)
- **Dino Fofo:** `bottom: 24px`, `left: -10px` (w-32)
- As árvores, palmeiras e nuvens devem respeitar a sobreposição (Z-index), mantendo a origem de transformação `transformOrigin: 'bottom center'` no RN Native (via Reanimated anchor point) para simular o vento adequadamente.

---

## 10. Detalhamento da Aba Social / Comunidade (`CommunityView.tsx`)

A aba "Comunidade" possui um design complexo, escuro e vibrante, que requer atenção redobrada do agente na migração.

- **Cores de Fundo e Layout:**
  - Fundo principal extremamente escuro: `bg-[#060b13]`.
  - Cabeçalho: Títulos com a fonte `Poppins` em branco puro, e subtítulos em cinza `text-gray-400`.
- **Cenários / Filtros (Foco, Sono, Relaxamento, Infantil, Transporte):**
  - Ícones associados (Lucide): `Circle` (Foco), `Moon` (Sono), `Trees` (Relaxamento), `Baby` (Infantil), `Bus` (Transporte).
  - Quando inativos: Bordas de vidro (`border-white/5`), fundo translucido.
  - Quando ativos: Fundo mais iluminado (`bg-white/10`), borda evidenciada (`border-white/30`).
- **Cards dos Mixers (RecipeCards):**
  - Fundo do cartão: `bg-[#060b13]`.
  - Efeito "Glow" Dinâmico: A cor de cada mix (receita) injeta-se em uma *box-shadow* (`0 0 20px {cor}40`) e num gradiente radial rotativo em background (no Web, manipulado via Framer Motion). No React Native, esse *glow* e rotação devem ser reconstruídos usando `react-native-reanimated` ou `react-native-linear-gradient`.
- **Animações (Equalizador):**
  - Durante o *play* de um mix na comunidade, o ícone central pulsa (escala e opacidade) e as barras (tags) de volume flutuam, gerando um pequeno brilho circular na ponta de cada barra (`box-shadow` dinâmico atrelado à cor da receita). Tudo isso deve ser migrado para o `SharedValue` do Reanimated no mobile.

---

## 11. Regras Lógicas de Importação de Áudio e Criação de Mixers

**A. Importação de Áudio Personalizado (Mixer Principal)**
- **Web Atual:** O usuário clica em "Importar Áudio", o app aciona um input invisível `<input type="file" accept="audio/*">`. O áudio selecionado ganha o prefixo `imported-<timestamp>` e seu `URL.createObjectURL` é carregado pelo Audio Engine, enquanto a interface exibe o `<MathematicalVisualizer>` para preencher a tela com o áudio desconhecido.
- **Migração (React Native):** O agente DEVE remover a tag de input HTML. Ao clicar em Importar Áudio, o sistema acionará obrigatoriamente a biblioteca nativa **`expo-document-picker`** (`getDocumentAsync({ type: 'audio/*' })`). A URI local será salva no estado e montada num player do pacote **`expo-av`**.

**B. Publicação de um Mixer Personalizado**
- **Web Atual:** Utiliza o componente `<PublishMixOverlay>`. Ele captura o estado atual de `volumes`, sons ativos, configurações de Equalizador (Bass, Mid, Treble) definidos pelo usuário, pede um Título, uma Categoria, uma Palavra-chave/Cor e salva no cache (`localStorage` via chave `published_community_mixes`).
- **Migração (React Native):** O overlay de publicação deve ser um `Modal` nativo sobreposto. Os dados capturados do painel devem ser preservados e enviados para o **AsyncStorage** (para uso local provisório), permitindo que os mixes customizados surjam imeditamente no fluxo da Aba Social (`CommunityView`), mantendo toda a arquitetura de equalização associada.

"""

with open('README.md', 'w') as f:
    f.write(content + append_text)

print("Appended section 9, 10, and 11.")
