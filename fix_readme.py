import re

with open('README.md', 'r') as f:
    content = f.read()

# Replace the incorrect Guardian/Panic text
new_guardian_cars = """- **Tema Carros (Semáforo Inteligente):** A tela Guardião não usa um Shader 3D tradicional aqui. Em vez disso, ela é um "Semáforo Inteligente" acoplado ao microfone (`expo-av`). 
  - **Luz Verde:** Pulsando devagar (Ruído seguro).
  - **Luz Amarela:** Aciona quando o ruído ambiente passa de 40dB.
  - **Luz Vermelha:** Aciona aos 70dB ou mais, e redireciona automaticamente a criança para a tela SOS Pânico."""

new_panic_cars = """- **Tema Carros (Pista Infinita):** A tela SOS Pânico possui assets de rodovia/pistas em translação e efeitos visuais contínuos (background dinâmico usando translações `translateX` e `translateY` de SVGs/Imagens). 
- **Diretriz de Migração:** No React Native, **utilize `react-native-reanimated` (`useSharedValue` e `withRepeat`)** para manter a pista e o cenário de fundo do tema carros em movimento contínuo (loop infinito de scroll visual) sem consumir memória pesada, acompanhando a velocidade da respiração da criança."""

# Find and replace in the text
content = re.sub(r'- \*\*Tema Carros:\*\* A tela Guardião possui assets em translação.*?pesada\.', new_guardian_cars, content, flags=re.DOTALL)
content = re.sub(r'- \*\*Tema Carros:\*\* Além dos shaders nos outros temas, o Tema Carros possui \*\*Animações Customizadas de HUD/Velocímetro.*?sinalização\.', new_panic_cars, content, flags=re.DOTALL)

# Add Pink Noise Modification
pink_noise_mod = """
### 12.4 Modificação Exclusiva: Mixer "Ruído Rosa"
O Mixer de "Ruído Rosa" (Pink Noise) recebeu modificações estritas de Engenharia que o diferem dos outros áudios:
1. **Síntese Matemática (Audio Engine):** Em vez de tocar apenas um arquivo MP3 estático, o Ruído Rosa web possui uma rotina algorítmica própria que o sintetiza em tempo real para fins terapêuticos perfeitos (usando os filtros de Paul Kellet: `b0 = 0.99886 * b0 + white * 0.0555179`, etc.). O agente deve garantir que, se for reescrever o áudio, preserve essa fidelidade acústica, pois é crucial para a audição de usuários com TEA.
2. **Shader Dinâmico e Interativo:** É o único mixer amarrado ao `PinkNoiseShader.tsx` que possui o sistema de simulação de partículas altamente responsivo (`baseHue: 330`) com "bloom passes", focando na dinâmica interativa da nebulosa rosa. 
"""

content = content + pink_noise_mod

with open('README.md', 'w') as f:
    f.write(content)

print("Readme fixed.")
