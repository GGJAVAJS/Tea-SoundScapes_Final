import re

with open('README.md', 'r') as f:
    content = f.read()

new_section = """
---

## 22. Barra de Navegação Inferior (Bottom Tabs / Navbar)

A barra de navegação principal (BottomNav) não é um componente estático padrão. Ela possui um design de **Glassmorphism flutuante** com inteligência de cores que mapeia ativamente o Modo e Tema atual do usuário. O Agente Antigravity DEVE construir este componente no React Native utilizando custom `TabBar` no `@react-navigation/bottom-tabs` respeitando a fidelidade absoluta dos estilos abaixo.

### 22.1 Estrutura e Ícones (Lucide)
O Navbar contém 5 abas representadas estritamente pelos seguintes ícones (importados da biblioteca `lucide-react-native`):
1. **Início (Home):** Ícone `Home`
2. **Guardião (Shield):** Ícone `Shield`
3. **Social (Users):** Ícone `Users`
4. **Diário (BarChart2):** Ícone `BarChart2`
5. **Eu (User):** Ícone `User`

### 22.2 Layout e Vidro Flutuante (Glassmorphism)
- **Container Flutuante:** A barra não é colada nas bordas da tela. Ela é um "Pill" flutuante posicionado no rodapé (`bottom-6` ou `paddingBottom: 24`), centralizado com largura máxima (`max-w-md`), contornos totalmente arredondados (`rounded-full`), e recebe uma borda fina de luz `border-white/10`.
- **Dinâmica de Blur (Desfoque):**
  - **Modo Adulto:** Aplica-se um desfoque intenso `blur(12px)` simulando vidro fosco (`glass-card`).
  - **Modo Infantil:** O desfoque é reduzido estritamente para `blur(2px)`. Como os fundos infantis são muito mais vivos (3D shaders, nuvens e pistas), o desfoque intenso geraria "borrões" feios na tela.

### 22.3 Feedback de Seleção e Cores Temáticas Ativas
Ao clicar em uma aba, o ícone aumenta de espessura (de `strokeWidth={1.75}` para `2.5`), o texto da label muda para Branco puro (`text-white font-semibold`), e o aplicativo injeta uma bolha de brilho (Glow Background) e pinta a linha do ícone com a **Cor Exata do Tema Ativo**:

- **Modo Adulto (Padrão):** 
  - Cor do Ícone: Azul Celeste (`#38bdf8`).
  - Glow/Background do Ícone: `bg-accent-blue/20` com `blur-md`.
- **Modo Infantil - Tema Espaço Sideral:** 
  - Cor do Ícone: Roxo Galáctico (`#602EC9`).
  - Glow/Background do Ícone: `bg-[#602EC9]/30`.
- **Modo Infantil - Tema Dinossauros:** 
  - Cor do Ícone: Verde Ácido/Neon (`#80F356` / `rgba(128, 243, 86, 0.95)`).
  - Glow/Background do Ícone: `bg-[#80F356]/25`.
- **Modo Infantil - Tema Carros:** 
  - Cor do Ícone: Amarelo Sinalização (`#FFE838`). *(Nota: É exatamente este amarelo vívido exibido na aba ativa do "Início").*
  - Glow/Background do Ícone: `bg-[#FFE838]/20`.

**Diretriz Migratória RN:** Para os textos das labels que possuem tamanho `11px` (`text-[11px]`), use a fonte padrão de UI do app (`Inter` ou font do sistema nativo `system-ui`). Para o Glow/Sombra atrás do ícone selecionado, em vez de CSS filter blur, utilize uma `<View>` em posição absoluta atrás do ícone renderizado, pintada com a cor do tema, baixa opacidade, bordas arredondadas e um leve efeito de elevação ou blur nativo para não comprometer a performance.
"""

content += new_section

with open('README.md', 'w') as f:
    f.write(content)

print("Navbar section appended successfully.")
