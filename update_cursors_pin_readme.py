import re

with open('README.md', 'r') as f:
    content = f.read()

# Fix PIN in Section 14
content = re.sub(
    r'mas sim um menu imersivo, lúdico e isolado pelo PIN Parental\.',
    r'mas sim um menu imersivo e lúdico. (NOTA CORRETIVA: A tela EU/Perfil é aberta para a criança. O PIN Parental bloqueia o acesso à tela **DIÁRIO**, onde residem informações sensíveis e análises.)',
    content
)

# Fix PIN in Section 19.5
content = re.sub(
    r'- \*\*Modo Infantil:\*\* Bloqueado pelo PIN Parental de 4 dígitos\. Sobreposto',
    r'- **Modo Infantil:** Acesso livre (SEM PIN). Sobreposto',
    content
)

# Add PIN logic to 19.2 Tela DIÁRIO
content = re.sub(
    r'### 19.2 Tela DIÁRIO \(DiaryView\)\nDividida em duas sub-abas no topo:',
    r'### 19.2 Tela DIÁRIO (DiaryView)\n**Bloqueio Restrito (Modo Infantil):** O acesso a esta tela inteira exige a digitação do PIN Parental de 4 dígitos criado no Onboarding.\nDividida em duas sub-abas no topo:',
    content
)

# Add Publish logic to 19.3 Tela SOCIAL
content = re.sub(
    r'- \*\*Feed:\*\*',
    r'- **Botão Publicar:** Existe EXCLUSIVAMENTE no Modo Adulto. A criança não tem permissão para publicar áudios.\n- **Feed:**',
    content
)

# Append Section 22 for Sliders
section_22 = """
---

## 22. Controles Deslizantes (Cursores) do Player Interno Infantil

No Mixer Principal, quando o "Player Interno" é expandido no Modo Infantil, os cursores (thumbs) dos controles de áudio abandonam o visual padronizado e tornam-se elementos lúdicos interativos, customizados por tema.

### 22.1 Imagens dos Cursores de Volume
O Slider de Volume Mestre utiliza imagens estritas como *thumb* (a "bolinha" que o usuário arrasta):
- **Tema Espaço Sideral:** `naveet.png` ou `rocekt.png` (O foguete ou a nave movem-se ao longo da trilha).
- **Tema Dinossauros:** `dino_fofo.png` ou `dinosaur_smile.png` (O rosto ou corpo do dinossauro desliza).
- **Tema Carros (A Exceção Animada):** O cursor de volume NÃO utiliza PNG. É um **carro animado desenhado do zero**.
  - **Implementação RN:** O Agente Antigravity deve construir este cursor utilizando `react-native-reanimated` e `react-native-gesture-handler`. O carro deve ser montado via `react-native-svg` ou `<View>`s estilizadas. Conforme o usuário arrasta o cursor (PanGesture), o valor `X` deve ser extrapolado (`interpolate`) para aplicar uma animação de rotação (`rotateZ`) nas rodas do carro, simulando o pneu girando proporcionalmente à velocidade do arrasto.

### 22.2 Imagens dos Cursores de Equalização (Mixer Avançado Infantil)
*(Nota: O botão de 3 pontinhos sumiu da tela Inicial, mas dentro do **Player Interno Expandido**, a criança possui controles lúdicos de frequência).*
As três frequências básicas (Graves, Médios, Agudos) utilizam os seguintes assets como *thumb*:
- **Tema Espaço Sideral:**
  - Graves: `asteroide.png`
  - Médios: `asteroide2.png`
  - Agudos: `moon.png` (ou `estrela_cadente.png`)
- **Tema Dinossauros:**
  - Graves: `fossil_rex.png` (fóssil maior/pesado)
  - Médios: `fossil.png` (fóssil comum)
  - Agudos: `cloud.png` (nuvem leve)
- **Tema Carros:** Elementos visuais de corrida (ex: pneu rodando, cone, ou marcadores de painel), construídos nativamente.

O Agente deve substituir a propriedade `thumbImage` (se suportada pela lib de slider nativa) ou construir um Slider customizado usando Reanimated (`useAnimatedStyle`) onde a Imagem/View translada sobre a linha do volume.
"""

content += section_22

with open('README.md', 'w') as f:
    f.write(content)

print("PIN corrected, Publish button constrained, and Cursors/Thumbs logic appended.")
