import re

with open('README.md', 'r') as f:
    content = f.read()

new_content = """
---

## 15. Mapeamento de Áudios e Shaders (Mixer Principal)

A tela Inicial (Home) possui o Mixer Principal. Os áudios nativos disponíveis são os mesmos tanto para o **Modo Adulto** quanto para o **Modo Infantil**, garantindo a mesma capacidade terapêutica. No entanto, no **Modo Infantil**, ao reproduzir um áudio, o *Player Interno* reage exibindo um **Shader 3D/WebGL específico** de acordo com a faixa "Dominante". 

Abaixo está o mapeamento estrito das faixas de áudio nativas, seus IDs, e o Shader que o Agente Antigravity DEVE carregar no Modo Infantil:

| Áudio (Mixer Principal) | ID interno | Shader Mapeado (Player Interno - Infantil) |
| :--- | :--- | :--- |
| **Ruído Branco** | `branco` | `Nucleus` (21st.dev) |
| **Ruído Rosa** | `rosa` | `PinkNoiseShader` (Partículas Responsivas Bloom) |
| **Ruído Marrom** | `marrom` | `light-speed` (Fuga espacial em hyperdrive) |
| **Chuva** | `chuva` | `rain-shader` (Gotas procedurais) |
| **Água / Rio** | `agua` | `water-shader` (Reflexos e ondas cáusticas) |
| **Vento** | `vento` | `quantum-nebula` (Padrão: GenerativeArtSceneV3) |
| **Natureza (Floresta)** | `natureza` | `NatureLandscapeShader` (Terreno e folhagens) |
| **Pássaros** | `passaros` | `UniverseWithinShader` (Pássaros/Conexões de rede) |
| **Lareira** | `lareira` | `fire-shader` (Chamas volumétricas) |
| **Áudio Importado** | `imported-<id>`| `MathematicalVisualizer` (Espectro Geométrico) |

*Nota:* No Modo Adulto, a renderização desses shaders é minimizada ou substituída por equalizadores limpos e interfaces minimalistas.

---

## 16. Mapeamento Estrito de Imagens (.png) por Tela e Tema

Para o Modo Infantil, as dezenas de imagens inseridas na pasta `/assets` possuem "endereços" corretos. O Agente não deve misturá-las. Segue a distribuição exata de onde cada `.png` deve ser renderizado:

### 16.1 Tela INÍCIO (HomeView - Background Flutuante)
Esta tela possui os cenários vivos (flutuantes) por trás do Mixer Principal.
- **Espaço Sideral:** `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `asteroide2.png`, `estrela_cadente.png`. *(Estas imagens ficam em órbita lenta usando translações `useSharedValue`).*
- **Dinossauros:** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`, `dino_alto.png`, `fantasia_dino.png`, `arvore.png`, `floresta.png`, `palmeiras.png`.
- **Carros:** `bandeira_corrida.png`, `carro.png`, `cone.png`, `piloto.png`, `chegada.png`, `cronometro.png`.

### 16.2 Tela DIÁRIO (Aba: "Como você está agora?" - Rastreador de Humor)
Nesta tela, a criança seleciona como está se sentindo usando avatares expressivos.
- **Espaço Sideral:** `happy-astronaut.png`, `astronaut-calm.png`, `alien_neutral.png`, `alien_sad.png`, `alien_rage.png`.
- **Dinossauros:** `dinosaur_happy.png`, `dinosaur_smile.png`, `dinosaur_neutral.png`, `dynosaurus_angry.png`, `dinossaur_rage.png`.
- **Carros (EXCEÇÃO):** **NÃO HÁ IMAGENS AQUI.** O tema Carros usa componentes de UI nativos (sliders visuais analógicos de painel, cores de termômetro de motor, etc.) para medir a emoção, sem depender de avatares PNG.

### 16.3 Tela EU (ProfileView / Configurações)
Esta é a tela de perfil e configurações da criança.
- **Espaço Sideral:** `naveet.png` (Nave espacial flutuando no topo da tela), `et.png` e `helmet.png`.
- **Dinossauros:** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`. *(Dino Fofo fica posicionado ancorado no rodapé à esquerda `bottom-24` `left-[-10px]`).*
- **Carros:** `race-lights.png`, `speed-meter.png`, `podium-stand.png`, `helmet.png`. *(Imagens compõem a estética de pista/pódio atrás das configurações).*

"""

with open('README.md', 'a') as f:
    f.write(new_content)

print("Audio and Image mapping appended successfully.")
