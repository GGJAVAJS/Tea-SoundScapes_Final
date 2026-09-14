import re

with open('README.md', 'r') as f:
    content = f.read()

# Update Section 18.5 (ProfileView / Configurações) to include button functionalities
profile_section = """### 18.5 Tela EU (ProfileView / Configurações)
O centro de gerenciamento (Logoff, Trocar Conta, Editar Perfil).
- **Modo Adulto:** Lista de configurações em "Glass Cards" escuros, fundo limpo.
- **Modo Infantil:** Lista de configurações em "Glass Cards" com a cores principais de determinado tema, Sobreposto com as imagens flutuantes estritas documentadas anteriormente (Nave, Dino Fofo, Pódio). O Logout DEVE forçar a limpeza absoluta do estado global (Zustand/Contexto) para evitar vazamento do tema infantil caso o pai logue em seguida e vice-versa caso acessa deslogue pelo modo adulto para acessar o infantil.

**Funcionalidades Estritas dos Botões da Tela EU (ProfileView):**
O Agente Antigravity DEVE replicar o mapeamento funcional dos menus da tela EU:
1. **Editar Perfil (Nome):** Permite alterar o nome de usuário (exibido nas boas-vindas). 
2. **Faço acompanhamento com psicólogo:** Toggle switch nativo que ativa ou desativa o painel extra de exportação (habilita o envio automático de relatórios em PDF do Diário).
3. **Contatos de Emergência:** Abre uma SubView para Adicionar, Editar ou Excluir números de telefone (usados no botão SOS Pânico e envio de SMS).
4. **Permissões do Sistema:** Gerenciador de acessos essenciais do aparelho. Solicita explicitamente permissão de Localização (GPS para o Guardião) e Notificações (para lembretes de diário e alertas).
5. **Tema Infantil (Apenas se configurado):** Abre a SubView de seleção de MUNDOS (Dinossauro, Carros, Espaço), que já injeta a cor correspondente em toda a UI.
6. **Trocar de Usuário (Logout Seguro):** Botão com destaque leve. Encerra a sessão, volta para AuthView e OBRIGATORIAMENTE executa a função de "Reset Total de Estado" (limpa Contexts/Zustand e navegação).
7. **Apagar Conta (Danger/Pânico):** Botão sublinhado ou vermelho. Exige confirmação ("Tem certeza?"). Exclui definitivamente as chaves locais (`MMKV` ou `AsyncStorage`) atreladas àquele `email` (Isolamento de Dados)."""

content = re.sub(r'### 18\.5 Tela EU \(ProfileView / Configurações\).*?(?=\n\n---)', profile_section, content, flags=re.DOTALL)


# Update Section 17.2 (DiaryView) to include the subtabs and designs
diary_section = """### 17.2 Tela DIÁRIO (DiaryView)
**Bloqueio Restrito (Modo Infantil):** O acesso a esta tela inteira exige a digitação do PIN Parental de 4 dígitos criado no Onboarding.
Dividida em **TRÊS sub-abas** no topo:

#### A) Aba "Registro" (Como você está agora?)
- **Funcionalidade:** Onde o usuário inputa seu estado atual (Rastreador de humor, gatilhos, e estratégias de enfrentamento).
- **Design Adulto:** Botões minimalistas (`glass-card`), sliders sóbrios (escala 1 a 10), paleta azul celeste (`#38bdf8`) para o botão "Salvar Registro".
- **Design Infantil:** Avatares temáticos substituem os números. Cores injetadas (Verde/Laranja para Dino, Amarelo/Vermelho para Carros, Roxo para Espaço). O botão final ganha texto adaptado ("Concluir" em vez de "Salvar Registro") e brilha com as cores do mundo escolhido.

#### B) Aba "Análises" (Dashboard de Insight IA)
- **Funcionalidade:** Renderiza os gráficos de progressão temporal (Barras/Linhas) baseados nas intensidades logadas. **Possui o Card de Insight da Inteligência Artificial** ancorado no topo, que processa a matriz de dados e devolve análises preditivas (descrito na Seção 16).
- **Design & Fontes:** 
  - Fundo limpo para não conflitar com a leitura de dados. 
  - Fonte dos Insights da IA: A caixa de Insight utiliza estilização Markdown (via lib `react-native-markdown-display` no RN), com fonte `Inter` ou nativa de corpo (`sans-serif`), garantindo espaçamento confortável (line-height: 1.5).
  - O gráfico em si recebe highlights (pontos de inflexão) usando a Cor Accent do tema (Azul no adulto, Roxo/Amarelo/Verde no infantil).

#### C) Aba "Relatórios" (Exportação e Histórico)
- **Funcionalidade:** Exibe uma lista em formato de *Cards* com o histórico de PDFs ou relatórios já fechados. Permite baixar (`Download`) ou compartilhar (`Share2`) para o Psicólogo via intent nativo de compartilhamento do aparelho (WhatsApp, Email).
- **Design:** Lista vertical contendo filtros (Mais Recentes, Mais Antigos, Mês, Ano).
- **Cores & Interações:** 
  - Os cartões de histórico ficam sob `rgba(255,255,255,0.05)` (Vidro/Glass).
  - O Botão "Compartilhar" ganha contorno e texto Azul Celeste (`#38bdf8`) com fundo translúcido `rgba(56,189,248,0.2)`.
  - O Botão "Excluir" (Lixeira) exige confirmação (*Slide down* ou Modais animadas usando `AnimatePresence`) e se pinta de Vermelho intenso (`#f43f5e`)."""

content = re.sub(r'### 17\.2 Tela DIÁRIO \(DiaryView\).*?(?=\n\n### 18\.3 Tela SOCIAL)', diary_section, content, flags=re.DOTALL)

with open('README.md', 'w') as f:
    f.write(content)

print("Profile buttons and Diary subtabs logic appended successfully.")
