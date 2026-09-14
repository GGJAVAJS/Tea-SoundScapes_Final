import re

with open('README.md', 'r') as f:
    content = f.read()

new_section_8 = """## 8. Posicionamento Estrito de Assets (Pixel-Perfect)

**ATENÇÃO:** O usuário exige que as posições originais das imagens flutuantes (Temas Infantis) sejam preservadas com 100% de fidelidade. Você NÃO tem permissão para alterar as coordenadas visuais na conversão para React Native.

- No Web, usamos as classes Tailwind utilitárias (ex: `top-[2%] left-[10%] w-36`).
- No React Native, você deve criar um `StyleSheet` (ou usar NativeWind) que mapeie exatamente esses valores matemáticos em posições absolutas baseadas na tela (`Dimensions.get('window')` ou porcentagens de flex).

**Exemplo - Espaço Sideral (`FloatingSpaceBackground.tsx`):**
- **Planet Big:** `bottom: -10%`, `right: -30%`, largura `w-[32rem]`, z-index `0`
- **Planet 2 (Ringed):** `top: 2%`, `left: 10%`, largura `w-36`, z-index `0`
- **Meteor:** `top: 10%`, `left: -5%`, largura `w-16`, z-index `10`
- **Moon:** `top: 35%`, `right: 15%`, largura `w-16`, z-index `0`
- **Planet 1 (`planet.png`):** `bottom: 10%`, `left: -10%`, largura `w-40`, z-index `0`
- **Satellite:** `top: 12%`, `right: 5%`, largura `w-24`, z-index `10`
- **Rocket:** `bottom: 25%`, `right: 5%`, largura `w-28`, z-index `10`
- **Asteroid 1:** `top: 55%`, `left: 8%`, largura `w-20`, z-index `10`
- **Asteroid 2:** `bottom: 15%`, `left: 30%`, largura `w-14`, z-index `10`
- **Estrela Cadente:** `top: 0`, `right: 0`, largura `w-40`, z-index `0` (animação cruzando a tela `x` e `y`)

**Exemplo - Dinossauros (`FloatingDinoBackground.tsx`):**
- **Nuvens (`cloud.png`):**
  - Nuvem 1: `-top-4`, `-left-4`, largura `w-32`
  - Nuvem 2: `-top-2`, `left-[20%]`, largura `w-32`
  - Nuvem 3: `top-0`, `left-[40%]`, largura `w-32`
  - Nuvem 4: `-top-2`, `right-[15%]`, largura `w-32`
  - Nuvem 5: `-top-4`, `-right-4`, largura `w-32`
- **Fóssil (`fossil.png`):** `top-24`, `left-4`, largura `w-24`
- **Fóssil Rex (`fossil_rex.png`):** `top-[35%]`, `right-2`, largura `w-28`
- **Personagens:**
  - **Dino Fofo:** `bottom-24`, `left-[-10px]`, largura `w-32`, z-index `10`
  - **Dino Alto (T-Rex):** `bottom-16`, `left-[20%]`, largura `w-64`, z-index `0`
  - **Fantasia Dino:** `bottom-28`, `right-[-10px]`, largura `w-32`, z-index `10`
- **Folhagens (Origem Base: `transformOrigin: 'bottom center'`):**
  - **Árvore:** `bottom-[-10px]`, `left-[-30px]`, largura `w-56`, z-index `20`
  - **Floresta:** `bottom-[-20px]`, `right-[-40px]`, largura `w-72`, z-index `20`
  - **Palmeiras 1:** `bottom-8`, `left-16`, largura `w-32`, z-index `30`
  - **Palmeiras 2:** `bottom-12`, `right-16`, largura `w-24`, z-index `30`

**Exemplo - Carros (`FloatingCarsBackground.tsx`):**
- **Bandeira Corrida Esquerda:** `top-[8%]`, `-left-6`, largura `w-32`
- **Bandeira Corrida Direita (Invertida):** `top-[8%]`, `-right-6`, largura `w-32`, escala x `-1` (espelhada)
- **Linha de Chegada (`chegada.png`):** `top-[5%]`, `left-[50%]`, largura `w-36`, deslocamento X `-50%` (centralizada)
- **Carro F1 (`carro.png`):** `top-[40%]`, `-left-8`, largura `w-44`
- **Cronômetro (`cronometro.png`):** `top-[45%]`, `-right-8`, largura `w-36`
- **Piloto (`piloto.png`):** `bottom-[10%]`, `left-[50%]`, largura `w-36`, deslocamento X `-50%` (centralizado), z-index `10`
- **Cones Esquerda (Conjunto de 3):**
  - Cone 1: `bottom-[2%]`, `-left-20`, largura `w-32`, z-index `10`
  - Cone 2: `bottom-[8%]`, `left-4`, largura `w-32`, z-index `10`
  - Cone 3: `bottom-[4%]`, `-left-6`, largura `w-40`, z-index `20`
- **Cones Direita (Conjunto de 3, espelhados `scaleX: -1`):**
  - Cone 1: `bottom-[2%]`, `-right-20`, largura `w-32`, z-index `10`
  - Cone 2: `bottom-[8%]`, `right-4`, largura `w-32`, z-index `10`
  - Cone 3: `bottom-[4%]`, `-right-6`, largura `w-40`, z-index `20`"""

content = re.sub(r'## 8\. Posicionamento Estrito de Assets \(Pixel-Perfect\).*?(?=\n\n---\n\n## 9\.)', new_section_8, content, flags=re.DOTALL)

with open('README.md', 'w') as f:
    f.write(content)

print("Image positions updated.")
