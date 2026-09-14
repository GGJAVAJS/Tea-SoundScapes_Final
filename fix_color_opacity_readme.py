import re

with open('README.md', 'r') as f:
    content = f.read()

# Replace Theme colors to include strictly opacities based on source code analysis
new_colors = """- **MODO ADULTO (Padrão/Sóbrio):**
  - **Fundo Base:** `#060b13` (Preto/Azul muito profundo).
  - **Cor de Destaque (Accent):** Azul Celeste (`#38bdf8`).
  - **Painéis/Cards:** Transparente com bordas sutis. (Cor base `rgba(255, 255, 255, 0.05)`, Bordas `rgba(255, 255, 255, 0.1)`, Hover `rgba(255, 255, 255, 0.1)` e `0.15` no Active).
  - **Botões Ativos:** Fundo `rgba(56, 189, 248, 0.15)` e Borda `rgba(56, 189, 248, 0.5)` com box-shadow leve.

- **MODO INFANTIL - TEMA DINOSSAUROS:**
  - **Laranja/Verde Destaque:** O aplicativo transita para laranja ao virar infantil (`#ff5c00`).
  - **Background EU/Perfil (DinoProfileBackground):** Possui um grandiente linear explícito do Laranja Frio/Marrom 50% de opacidade para o Verde Sólido. 
    `background: 'linear-gradient(to bottom, rgba(137, 92, 7, 0.5), rgba(42, 72, 6, 1))'` 
    *(Nota: `rgba(137, 92, 7, 0.5)` = `#895C07` com 50% de opacidade e `rgba(42, 72, 6, 1)` = `#2a4806` sólido).*
  - **Painéis e Cards (ProfileView):** A cor sólida opaca injetada para quebrar o vidro padrão é `#553100` (Marrom Terra Sólido).

- **MODO INFANTIL - TEMA ESPAÇO SIDERAL:**
  - **Cores Primárias:** Roxo Cósmico / Índigo (`#6366f1` ativo a `#a855f7`).
  - **Bordas e Sombras (Glow):** Fundo Roxo com 20% de opacidade (`bg-indigo-500/20`), Borda Sólida (`border-indigo-500`), Sombra Neon/Glow de 40% (`shadow-[0_0_20px_rgba(99,102,241,0.4)]`).
  - **Glow Extremidade:** Na tela de perfil, `box-shadow: 0 0 20px rgba(99,102,241,0.4)`.

- **MODO INFANTIL - TEMA CARROS:**
  - **Cores Primárias:** O seletor utiliza Vermelho com 20% de opacidade no fundo (`bg-red-500/20`), Borda Sólida vermelha e Glow Neon de 40% (`shadow-[0_0_20px_rgba(239,68,68,0.4)]`).
  - **Luzes Semáforo (Guardião):** 
    - Verde Seguro: Fundo sólido do neon (`#10b981` ou `bg-emerald-400`), Sombra espalhada (`shadow-[0_0_25px_#10b981]`), Base desligada opaca 40% (`bg-emerald-950/40`).
    - Amarelo Atenção: Fundo sólido amarelo (`#f59e0b` ou `bg-amber-400`), Sombra (`shadow-[0_0_25px_#f59e0b]`), Base desligada 40% (`bg-amber-950/40`).
    - Vermelho Perigo: Fundo sólido vermelho (`#ef4444` ou `bg-red-500`), Sombra (`shadow-[0_0_25px_#ef4444]`), Base desligada 40% (`bg-red-950/40`)."""

# Replace the whole section 20 list
content = re.sub(r'- \*\*MODO ADULTO \(Padrão/Sóbrio\):\*\*.*?(?=\n\n)', new_colors, content, flags=re.DOTALL)

with open('README.md', 'w') as f:
    f.write(content)

print("Colors updated with strict opacities.")
