import re

with open('README.md', 'r') as f:
    content = f.read()

# Replace Theme Carros Section in Colors
new_cars_color = """- **MODO INFANTIL - TEMA CARROS:**
  - **Fundo Base:** Diferente do Adulto que é um Dark Blue, o fundo base para o tema carros (especialmente na tela EU) usa um **Preto muito profundo com 93% de opacidade** (`backgroundColor: 'rgba(0, 0, 0, 0.93)'`).
  - **Cores Primárias (Seleção e Destaque):** O aplicativo utiliza Amarelo (`#eab308`) como destaque em painéis, mas nos seletores e alertas principais usa o Vermelho. O card de seleção do Onboarding utiliza **Vermelho 20% no fundo** (`bg-red-500/20`), Borda Sólida vermelha e Glow Neon Vermelho de 40% (`shadow-[0_0_20px_rgba(239,68,68,0.4)]`).
  - **Luzes Semáforo (Guardião):** 
    - Verde Seguro: Fundo sólido do neon (`#10b981` ou `bg-emerald-400`), Sombra espalhada (`shadow-[0_0_25px_#10b981]`), Base desligada opaca 40% (`bg-emerald-950/40`).
    - Amarelo Atenção (`#f59e0b` ou `bg-amber-400`), Sombra (`shadow-[0_0_25px_#f59e0b]`), Base desligada 40% (`bg-amber-950/40`).
    - Vermelho Perigo (`#ef4444` ou `bg-red-500`), Sombra (`shadow-[0_0_25px_#ef4444]`), Base desligada 40% (`bg-red-950/40`)."""

# Replace the whole section 20 Cars list
content = re.sub(r'- \*\*MODO INFANTIL - TEMA CARROS:\*\*.*?(?=\n\n|$)', new_cars_color, content, flags=re.DOTALL)

with open('README.md', 'w') as f:
    f.write(content)

print("Cars theme colors and background updated.")
