import re

with open('README.md', 'r') as f:
    content = f.read()

replacement = """Dividida em **TRÊS sub-abas** no topo:

> **Sincronização Visual das Sub-abas (Crucial):** O indicador da sub-aba ativa no topo da tela (seja Registro, Análises ou Relatórios) DEVE herdar a exata mesma cor utilizada no cursor da Navbar (BottomNav) selecionada. 
> - **Tema Espaço Sideral:** Texto e sublinhado ativo em Roxo Galáctico (`#602EC9`).
> - **Tema Dinossauros:** Texto e sublinhado ativo em Verde Ácido (`#80F356`).
> - **Tema Carros:** Texto e sublinhado ativo em Amarelo Sinalização (`#FFE838`).
> - **Modo Adulto:** Azul Celeste padrão (`#38bdf8`)."""

content = re.sub(r'Dividida em \*\*TRÊS sub-abas\*\* no topo:', replacement, content)

with open('README.md', 'w') as f:
    f.write(content)

print("Diary sub-tabs color synchronization updated.")
