import re

with open('README.md', 'r') as f:
    content = f.read()

# Refine Pink Noise to specify it's for the internal player on the main mixer in Child Mode
old_pink_noise = """### 12.4 Modificação Exclusiva: Mixer "Ruído Rosa"
O Mixer de "Ruído Rosa" (Pink Noise) recebeu modificações estritas de Engenharia que o diferem dos outros áudios:
1. **Síntese Matemática (Audio Engine):** Em vez de tocar apenas um arquivo MP3 estático, o Ruído Rosa web possui uma rotina algorítmica própria que o sintetiza em tempo real para fins terapêuticos perfeitos (usando os filtros de Paul Kellet: `b0 = 0.99886 \* b0 \+ white \* 0.0555179`, etc.). O agente deve garantir que, se for reescrever o áudio, preserve essa fidelidade acústica, pois é crucial para a audição de usuários com TEA.
2. **Shader Dinâmico e Interativo:** É o único mixer amarrado ao `PinkNoiseShader.tsx` que possui o sistema de simulação de partículas altamente responsivo (`baseHue: 330`) com "bloom passes", focando na dinâmica interativa da nebulosa rosa."""

new_pink_noise = """### 12.4 Modificação Exclusiva: Mixer "Ruído Rosa" (Player Interno - Modo Infantil)
O Mixer de "Ruído Rosa" (Pink Noise), quando acionado no **Player Interno da Aba Home no Modo Infantil**, possui comportamentos exclusivos de Engenharia que o diferem das demais faixas:
1. **Síntese Matemática (Audio Engine):** Em vez de tocar apenas um arquivo MP3 estático como os outros sons, o Ruído Rosa web possui uma rotina algorítmica própria que o sintetiza em tempo real para fins terapêuticos perfeitos (usando os filtros de Paul Kellet: `b0 = 0.99886 * b0 + white * 0.0555179`, etc.). O agente deve garantir que, se for reescrever o motor de áudio, preserve essa fidelidade acústica, pois é crucial para o conforto sensorial de usuários com TEA.
2. **Shader Dinâmico e Interativo:** O visualizador atrelado à faixa rosa (`PinkNoiseShader.tsx`) possui um sistema de simulação de partículas responsivo (`baseHue: 330` - tons magenta/rosa brilhantes) com "bloom passes". Este shader interativo sobrepõe as telas do Modo Infantil enquanto o Ruído Rosa for o som dominante."""

# Refine Cars Guardian to include colors and styles
old_guardian_cars = """- **Tema Carros (Semáforo Inteligente):** A tela Guardião não usa um Shader 3D tradicional aqui. Em vez disso, ela é um "Semáforo Inteligente" acoplado ao microfone (`expo-av`). 
  - **Luz Verde:** Pulsando devagar (Ruído seguro).
  - **Luz Amarela:** Aciona quando o ruído ambiente passa de 40dB.
  - **Luz Vermelha:** Aciona aos 70dB ou mais, e redireciona automaticamente a criança para a tela SOS Pânico."""

new_guardian_cars = """- **Tema Carros (Semáforo Inteligente):** A tela Guardião não usa um Shader 3D tradicional aqui. Em vez disso, ela é um "Semáforo Inteligente" acoplado ao microfone (`expo-av`). 
  - **Estética & Layout:** Fundo asfalto (cinza super escuro). Utiliza formas geométricas limpas lembrando um poste/semáforo (borda preta arredondada com as 3 lentes).
  - **Luz Verde (Ruído Seguro):** Verde neon brilhante (`#22c55e` ou similar) pulsando suavemente com brilho externo (Glow).
  - **Luz Amarela (Atenção):** Amarelo vibrante (`#eab308`), aciona quando o ruído ambiente passa de 40dB.
  - **Luz Vermelha (Perigo):** Vermelho sangue intenso (`#ef4444`), aciona aos 70dB ou mais, e aciona o redirecionamento imediato para a tela SOS Pânico."""

# Refine Cars Panic to include colors and styles
old_panic_cars = """- **Tema Carros (Pista Infinita):** A tela SOS Pânico possui assets de rodovia/pistas em translação e efeitos visuais contínuos (background dinâmico usando translações `translateX` e `translateY` de SVGs/Imagens). 
- **Diretriz de Migração:** No React Native, **utilize `react-native-reanimated` (`useSharedValue` e `withRepeat`)** para manter a pista e o cenário de fundo do tema carros em movimento contínuo (loop infinito de scroll visual) sem consumir memória pesada, acompanhando a velocidade da respiração da criança."""

new_panic_cars = """- **Tema Carros (Pista Infinita):** A tela SOS Pânico simula o interior de um carro à noite numa rodovia.
  - **Cores & Estilos (Dashboard):** Elementos em laranja fluorescente, azul painel e preto brilhante. As luzes de RPM e velocidade ditam o ritmo da respiração.
  - **Background Animado:** Rodovia/pistas com faixas pontilhadas amarelas/brancas em translação rápida simulando alta velocidade.
  - **Diretriz de Migração:** No React Native, **utilize `react-native-reanimated` (`useSharedValue` e `withRepeat`)** para manter a pista em movimento contínuo. As luzes do "velocímetro/RPM" devem preencher (scale/opacity) do verde ao laranja acompanhando perfeitamente a fase da respiração da criança ("Inspire... Expire...")."""

content = re.sub(r'### 12\.4 Modificação Exclusiva.*?nebulosa rosa\.', new_pink_noise, content, flags=re.DOTALL)
content = re.sub(r'- \*\*Tema Carros \(Semáforo Inteligente\):\*\*.*?para a tela SOS Pânico\.', new_guardian_cars, content, flags=re.DOTALL)
content = re.sub(r'- \*\*Tema Carros \(Pista Infinita\):\*\*.*?da respiração da criança\.', new_panic_cars, content, flags=re.DOTALL)


with open('README.md', 'w') as f:
    f.write(content)

print("Readme refined again.")
