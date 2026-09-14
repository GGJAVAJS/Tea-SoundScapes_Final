import re

with open('README.md', 'r') as f:
    content = f.read()

# Replace existing Section 13 with the comprehensive version
comprehensive_onboarding = """
## 13. Fluxo Exaustivo de Autenticação e Criação de Conta (Onboarding)

O Agente Antigravity DEVE dominar estritamente o fluxo de entrada do aplicativo passo a passo, pois ele define as barreiras de layout e estado lógico entre o Modo Adulto e o Modo Infantil.

### 13.1 Tela de Login (`AuthView`)
- **Estilo & Fundo:** Porta de entrada neutra e elegante. Possui fundo escuro puro (`bg-[#060b13]`), sem decorações infantis, apenas com dois gradientes radiais borrados ao fundo (`bg-accent-blue/10` blur-100px no top-left, e `bg-accent-purple/10` blur-80px no bottom-right).
- **Tipografia:** Fonte `Poppins` nos cabeçalhos (`TEA SoundScapes`) e `Inter` ou `Plus Jakarta Sans` no corpo.
- **Ação Nativa:** Inputs textuais escuros (glass card com borda `border-white/10`).
- **Navegação:** O botão "Criar conta (Boas-vindas)" deve inicializar o `OnboardingStack`.

### 13.2 Fluxo de Onboarding (Passo a Passo Rigoroso)
A tela `OnboardingView.tsx` gerencia 10 passos sequenciais (alguns bifurcados por modo). O `step` atual guia a renderização.

**Configurações Globais do Onboarding:**
- **Background Fixo:** Fundo escuro absoluto `bg-[#060b13]`.
- **Navegação Interna:** Há um botão "Voltar" nativo flutuando no topo para regredir o passo atual.
- **Animações (Transição entre Passos):** Na Web usamos `motion.div` com `opacity: 0, x: 20` para `opacity: 1, x: 0`. No RN, utilize a propriedade de animação de slide horizontal do `@react-navigation/native` ou englobe os sub-passos em views animadas com `react-native-reanimated`.

**Detalhamento Etapa por Etapa:**

- **Etapa 1: Boas Vindas**
  - Solicita apenas o nome (`setName`).
  - Cor do Botão "Começar": Rosa/Vermelho vibrante (`#f43f5e`) com *glow*.
- **Etapa 2: Registro de E-mail**
  - Solicita o e-mail (usado depois no SQLite local para isolar os dados das contas).
  - Possui botões visuais para Outlook, Google e Facebook (no RN, mantenha os ícones via imagens locais ou remotas `require/uri`).
- **Etapa 3: A ESCOLHA CRÍTICA (Modo Adulto vs. Infantil)**
  - O usuário escolhe entre `setThemeMode('adult')` ou `setThemeMode('child')`.
  - **Se o usuário escolher "Infantil":** O botão inferior de "Avançar" abandona a cor `bg-accent-blue` e ganha um gradiente linear Laranja vibrante (`linear-gradient(90deg, #ff0000 52%, #ff5c00 84%)`) e altera a classe CSS global do body (`document.body.classList.add('child-mode')` -> No RN, isso deve acionar a store do Zustand para ejetar cores diferentes nas próximas telas).
- **Etapa 4: Diagnóstico de Ruído (Onde o barulho incomoda?)**
  - Renderiza uma lista de locais (Transporte, Escola, Trabalho, Shopping, Casa). Múltipla escolha (Array). Cores padrão baseadas no `accent-blue`.
- **Etapa 5: Rede de Apoio (Guardião)**
  - Captura `supportName`, `supportPhone` e uma booleana (`alertSupport`).
  - Uma pergunta crítica embaixo: "Você faz acompanhamento com psicólogo?" (`setHasTherapist`).
- **Etapa 6: Permissão de Microfone**
  - Educa o usuário sobre a segurança do monitoramento de áudio.
  - Na web usamos `navigator.mediaDevices.getUserMedia`. **MIGRAÇÃO:** O Antigravity DEVE converter isso obrigatoriamente para `Audio.requestPermissionsAsync()` do `expo-av`.
- **Etapa 7 (Modo Infantil): Escolha o seu Mundo!**
  - *Somente visível se o passo for 7 e `themeMode === 'child'`.*
  - A interface exibe "Qual é o seu mundo favorito? 🌎" com um texto Laranja Forte (`text-[#ff5c00]`).
  - Exibe 3 botões em Grid (Dinossauros com borda Laranja/Verde, Espaço Sideral com borda Indigo/Roxa, Carros com borda Vermelha).
  - O botão "Avançar" continua com a cor Laranja (`bg-[#ff5c00]`).
- **Etapa 8 (Modo Infantil): Filtro de Autonomia**
  - O app pergunta: "A criança fará o registro de suas próprias emoções após o uso do Som Refúgio?".
  - Liga/desliga a booleana `childAutonomyFilter`. Se sim, a tela pós-crise exigirá uma avaliação de humor.
- **Etapa 9 (Infantil) ou Etapa 7 (Adulto): Escolha seu Refúgio (Áudio de Emergência)**
  - O usuário escuta pre-views (Ruído Marrom, Som de Chuva, Som Delta Suave).
  - *Atenção Migração:* O agente precisa invocar `Audio.Sound.createAsync` no Expo AV ao invés do nosso `playSound` web genérico para garantir que o áudio de preview toque na inicialização.
- **Etapa 10 (Somente Modo Infantil): Proteger o Diário 🔒 (PIN Parental)**
  - Obriga a inserção do `pin` e `confirmPin` de 4 dígitos.
  - Os inputs usam espaçamento largo de texto (`tracking-[1em]`) para destacar as bolinhas da senha. **Migração:** O Agente deve assegurar que o teclado nativo acione o `keyboardType="number-pad"` no `<TextInput>`.
- **Etapa Final: Tudo Pronto ✨**
  - Um ícone gigante de confere (verde) anuncia que o cadastro está completo.
  - Salva todos os dados no armazenamento local (No RN, use `expo-sqlite` ou `MMKV` atrelado ao email inserido no passo 2).
"""

content = re.sub(r'## 13\. Fluxo de Autenticação.*?## 14\. Detalhamento', comprehensive_onboarding + "\n\n## 14. Detalhamento", content, flags=re.DOTALL)

with open('README.md', 'w') as f:
    f.write(content)

print("Exhaustive onboarding flow applied.")
