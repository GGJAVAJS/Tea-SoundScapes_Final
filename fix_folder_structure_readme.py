import re

with open('README.md', 'r') as f:
    content = f.read()

# Update Section 7
new_section_7 = """## 7. Mapeamento Completo de Assets e Ícones

Todo asset estático referenciado no React Web precisará ser movido para a estrutura de pastas nativa exigida no Expo. A organização DEVE ser estritamente dividida:
- **Sons e Áudios:** Devem ser colocados em `/assets/sounds/`.
- **Imagens dos Temas:** Devem ser organizadas dentro de `/assets/themes/`, divididas em subpastas específicas para não haver colisão de nomes.

### 7.1 Imagens Temáticas (.png)
O App utiliza abundantes imagens 2D (geradas por IA ou vetorizadas) com canal Alpha (`.png`). A estrutura de caminhos é mandatória:

- **Pasta `/assets/themes/space/` (Tema Espaço Sideral):** `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `asteroide2.png`, `estrela_cadente.png`, `naveet.png`, `et.png`, icones de humor (`happy-astronaut.png`, `astronaut-calm.png`, `alien_neutral.png`, `alien_sad.png`, `alien_rage.png`).
- **Pasta `/assets/themes/dinossauro/` (Tema Dinossauros):** `cloud.png`, `fossil.png`, `fossil_rex.png`, `dino_fofo.png`, `dino_alto.png`, `fantasia_dino.png`, `arvore.png`, `floresta.png`, `palmeiras.png`, os icones de humor (`dinosaur_happy.png`, `dinosaur_smile.png`, `dinosaur_neutral.png`, `dynosaurus_angry.png`, `dinossaur_rage.png`).
- **Pasta `/assets/themes/cars/` (Tema Carros):** `race-lights.png`, `speed-meter.png`, `podium-stand.png`, `bandeira_corrida.png`, `carro.png`, `cone.png `, `piloto.png`, `chegada.png`, `cronometro.png`, `helmet.png `.

> **Comando de Migração de Imagem:** 
> Web: `<img src="/planet.png" />` ou `style={{ backgroundImage: "url('/et.png')" }}`
> Nativo: `<Image source={require('../assets/themes/space/planet-big.png')} style={{ width: X, height: Y, resizeMode: 'contain' }} />`"""

content = re.sub(r'## 7\. Mapeamento Completo de Assets e Ícones.*?> Nativo: `<Image source={require\(\'\.\./assets/planet\.png\'\)} style={{ width: X, height: Y, resizeMode: \'contain\' }} />`', new_section_7, content, flags=re.DOTALL)

# Update Section 14
content = re.sub(r'Para o Modo Infantil, as dezenas de imagens inseridas na pasta `/assets` possuem "endereços" corretos\.', r'Para o Modo Infantil, as dezenas de imagens inseridas na pasta `/assets/themes` possuem "endereços" e pastas estritas corretas.', content)

# Update Section 5.3 (Mídias e Áudios flutuantes)
content = re.sub(r'devem ser movidas para a pasta `/assets` e requisitadas no código: `<Image source={ require\(\'\.\./assets/rocekt\.png\'\) }', r'devem ser rigorosamente distribuídas em suas subpastas dentro de `/assets/themes/` (ex: `/assets/themes/space`, `/assets/themes/dinossauro`, `/assets/themes/cars`) e requisitadas no código: `<Image source={ require(\'../assets/themes/space/rocekt.png\') }', content)


with open('README.md', 'w') as f:
    f.write(content)

print("Folder structure for assets updated.")
