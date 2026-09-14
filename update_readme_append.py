import os

with open('README.md', 'r') as f:
    content = f.read()

append_block = """
## 7. Paleta de Cores e Identidade Visual (Design System)

A separação dos temas via cor é o que baliza o isolamento lógico das interfaces. Abaixo estão as paletas extraídas do Tailwind que DEVEM ser portadas via `StyleSheet` nativo ou NativeWind.

### 7.1 Modo Adulto & Telas Comuns (Login, Setup)
- **Fundo Principal (Background):** Slate/Dark muito profundo (`bg-slate-950`, `#020617` ou Black `#000000`).
- **Cards/Superfícies (Glassmorphism):** Preto com leve transparência (`bg-black/40` ou `rgba(255,255,255,0.05)`), suportando `backdrop-blur`.
- **Cores de Ação (Accent):** Azul Celeste (`#38bdf8` / `accent-blue`). Utilizado em botões primários, sliders e highlights.
- **Botões de Risco (Pânico/Logout):** Vermelhos profundos/brilhantes (ex: `#e11d48`).
- **Modo Pânico (Panic Overlay):** Fundo translúcido avermelhado com fortes animações de "breathing" e botões grandes contrastantes.

### 7.2 Modos Infantis (Temáticos)
As cores não apenas definem a estética, mas injetam-se nas caixas de diálogos, bordas e textos.

- **Dino (Dinossauros):**
  - **Fundo / Container Base:** Marrom Terra Escuro (`#553100`) ou `bg-[#2a1700]` para fundos profundos.
  - **Cor de Ação/Destaque (Accent):** Verde Neon Vibrante (`#80F356`).
- **Space (Espaço Sideral):**
  - **Fundo / Container Base:** Roxo Cósmico Escuro (`#110D1F`) ou Azul Meia-noite.
  - **Cor de Ação/Destaque (Accent):** Roxo Intenso (`#602EC9`) ou Violeta (`#482496`).
- **Cars (Carros):**
  - **Fundo / Container Base:** Cinza Asfalto / Dark.
  - **Cor de Ação/Destaque (Accent):** Amarelo Trânsito/Sinalização (`#FACC15`).

*(Nota ao Agente: Utilize Context API ou um hook como `useTheme` no RN para expor essas variáveis. NÃO interlace classes inline diretamente.)*

---

## 8. Mapeamento Completo de Assets e Ícones

Todo asset estático referenciado no React Web precisará ser movido para a pasta raiz `/assets` (ou equivalente no Expo) e encapsulado usando a sintaxe nativa `require()`.

### 8.1 Imagens Temáticas (.png)
O App utiliza abundantes imagens 2D (geradas por IA ou vetorizadas) com canal Alpha (`.png`).

- **Tema Espaço Sideral:** `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `asteroide2.png`, `estrela_cadente.png`, `naveet.png`, `et.png`, `helmet.png`, avatares humor (`happy-astronaut.png`, `alien_neutral.png`, etc).
- **Tema Dinossauros:** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`, `dino_alto.png`, `fantasia_dino.png`, `arvore.png`, `floresta.png`, `palmeiras.png`, e os icones de humor `dinosaur_happy.png`, `dinosaur_smile.png`, etc.
- **Tema Carros:** `race-lights.png`, `speed-meter.png`, `podium-stand.png`.

> **Comando de Migração de Imagem:** 
> Web: `<img src="/planet.png" />` ou `style={{ backgroundImage: "url('/et.png')" }}`
> Nativo: `<Image source={require('../assets/planet.png')} style={{ width: X, height: Y, resizeMode: 'contain' }} />`

### 8.2 Ícones de Vetor (Lucide)
O sistema web usa amplamente o pacote `lucide-react`. 
- **Contextos Adulto/Sistema:** `User`, `Shield`, `Bell`, `Info`, `Lock`, `Settings`, `LogOut`.
- **Controles do Mixer (Audio):** `Volume2`, `Play`, `Pause`, `Activity`.
- **Rastreadores:** `Moon` (Sono), `Heart` (Humor/Sentimento), `Book` (Diário).
- **Rede de Apoio:** `Phone`, `MapPin` (Localização).

> **Comando de Migração de Ícone:**
> Substituir todo o pacote para `lucide-react-native`.
> Adicionar tamanho e cor via propriedades explícitas, já que as classes Tailwind não aplicarão regras SVG (ex: `<Mic size={24} color="#38bdf8" />`).

"""

with open('README.md', 'a') as f:
    f.write(append_block)

print("Appended sections 7 and 8 successfully.")
