import re

with open('README.md', 'r') as f:
    content = f.read()

replacement = """#### A) Aba "Registro" (O Formulário do Diário)
- **Funcionalidade:** Onde o usuário inputa seu estado atual passando por 4 etapas estruturais: "Como você está agora?", "O que aconteceu?", "O que ajudou você a se acalmar?", e "Observação / Diário".
- **Sincronização Absoluta de Cores (UI Interna):** Todo e qualquer elemento interativo DENTRO deste formulário deve acender, marcar ou ser preenchido com a EXATA cor do tema selecionado (a mesma da Navbar: Azul Celeste, Roxo Galáctico, Verde Ácido ou Amarelo Sinalização). Isso inclui:
  - O cursor/slider numérico (Modo Adulto) ou a borda de seleção do Avatar (Modo Infantil) na seção "Como você está agora?".
  - Os botões (Pills) multi-seleção de "Gatilhos" e "Estratégias". Quando clicados, a borda, o texto e o fundo translúcido assumem a cor do tema.
  - A borda de foco (focus) da caixa de texto de Observações.
  - O Botão de envio no fim da página ("Salvar Registro" no Adulto / "Concluir" no Infantil). Ele terá o fundo translúcido, borda e o Glow (sombra) irradiando estritamente a cor do mundo escolhido."""

content = re.sub(
    r'#### A\) Aba "Registro" \(Como você está agora\?\)\n- \*\*Funcionalidade:\*\*.+?cores do mundo escolhido\.', 
    replacement, 
    content, 
    flags=re.DOTALL
)

with open('README.md', 'w') as f:
    f.write(content)

print("Diary registration form colors synchronized.")
