import re

with open('README.md', 'r') as f:
    content = f.read()

new_section = """
---

## 21. Interações, Hover e Estados de Clique (Feedback Tátil)

O aplicativo web possui uma mecânica de feedback visual rigorosa (usando `:hover` e `:active` no CSS e Tailwind). Como o React Native **não possui hover de mouse**, o Agente Antigravity DEVE traduzir todo esse comportamento para **Estados de Pressão (Press/Touch)** utilizando o componente `<Pressable>` ou animações do `react-native-reanimated` (escala e opacidade).

A regra de ouro do aplicativo é: **Nenhum botão é estático. Todos reagem ao toque.**

### 21.1 Mecânica Global de Escala (Active State)
- Todos os botões clicáveis do aplicativo web usam a classe `active:scale-95` ou `transform: scale(0.98)` no CSS.
- **Migração RN:** O Agente deve envolver os botões interativos num `<Pressable>` e aplicar uma transformação de `scale` (encolhimento) de 0.98 ou 0.95 enquanto a propriedade `pressed` for verdadeira.

### 21.2 Comportamento Específico por Componente
- **Botões de Emergência (Meu Refúgio e SOS Pânico):** 
  - *Web:* Ganham brilho extra e encolhem (`active:scale-95`). O "SOS Pânico" vibra visualmente.
  - *Mobile:* Devem usar animação de "spring" (mola) no clique para dar peso e urgência. Ao tocar, a sombra (Glow Neon) deve expandir levemente enquanto o botão encolhe.
- **Toggles do Mixer Principal (Ativar/Desativar Sons):**
  - *Web:* Botões de vidro (`glass-card`). No `:hover` passam de fundo `rgba(255, 255, 255, 0.05)` para `0.1` e borda `0.25`. No clique (`:active`), o fundo vai para `0.15` e o botão encolhe. Quando ativados (`glass-card-active`), recebem um brilho azul (`rgba(56, 189, 248, 0.15)`).
  - *Mobile:* Como não há hover, o momento do `pressed` no `<Pressable>` deve engatilhar imediatamente o estado `:active` (fundo `0.15` e `scale(0.98)`). 
- **Aba Social (Mixes da Comunidade e Filtros):**
  - Os botões de Filtro (ex: "Foco", "Relaxamento") no topo da aba Social são "Pills" (pílulas). Quando não selecionados, têm borda sutil e fundo transparente. Ao clicar, dão um "pulo" (`active:scale-95`) e se preenchem com a cor de destaque (Azul no adulto, Laranja/Roxo/Vermelho nos temas infantis).
  - Os Cards de Áudio compartilhados na timeline reagem ficando levemente mais claros (iluminados) ao serem pressionados antes de o áudio começar a tocar no rodapé.
- **Menus e Opções da Tela EU (Configurações):**
  - Itens de lista como "Editar Perfil" ou "Meus Contatos" usam `hover:bg-white/10` e `active:bg-white/10`.
  - *Mobile:* O Agente deve usar `underlayColor` (se usar `TouchableHighlight`) ou alterar o background para `rgba(255,255,255,0.1)` (ou fundo mais escuro nos temas) durante o toque (`pressed`), fornecendo resposta imediata ao dedo do usuário.
"""

with open('README.md', 'a') as f:
    f.write(new_section)

print("Hover and tactile feedback section appended successfully.")
