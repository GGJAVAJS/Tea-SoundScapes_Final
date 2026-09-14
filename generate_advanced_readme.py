import os

shader_files = [
    'src/components/ui/MistyLakeShader.tsx',
    'src/components/ui/NightCloudsShader.tsx',
    'src/components/ui/PinkNoiseShader.tsx',
    'src/components/ui/quantum-nebula.tsx',
    'src/components/ui/SoundNebulaShader.tsx'
]

shader_content = ""
for file in shader_files:
    if os.path.exists(file):
        with open(file, 'r') as f:
            shader_content += f"### Arquivo Original Web: `{os.path.basename(file)}`\n```tsx\n{f.read()}\n```\n\n"

readme_template = f"""# 🚀 DIRETRIZ DE MIGRAÇÃO ARQUITETURAL: TEA SoundScapes (Web ➔ React Native)

**Atenção Agente Antigravity:** Este documento é a sua **Diretriz Estrita de Arquitetura**. Você é o engenheiro responsável por portar o ecossistema "TEA SoundScapes" (atualmente em React/Vite web) para um aplicativo móvel nativo suportando iOS e Android via **React Native e Expo**.

Siga os comandos e os mapeamentos abaixo de forma exaustiva. Não desvie da stack estipulada. 

---

## 1. Mapeamento de Arquitetura e Roteamento (Web para Nativo)

A interface atual web é baseada em manipulação de estado (`currentView`, `subView`) e componentes HTML semânticos. Para a migração nativa, você deve adotar uma abordagem estritamente voltada para componentes móveis e roteamento em pilha (Stack).

### 1.1 Conversão de Primitivas de UI
Você deve substituir TODAS as primitivas HTML pelas primitivas do React Native:
- `<div>` e `<section>` ➔ `<View>` ou `<SafeAreaView>`
- `<span>`, `<p>`, `<h1>` a `<h6>` ➔ `<Text>` (respeitando herança de estilo de fontes)
- `<button>` ➔ `<TouchableOpacity>` ou `<Pressable>`
- `<input>`, `<textarea>` ➔ `<TextInput>` (atente-se para `keyboardType` e suporte a multiline)
- `<img>` ➔ `<Image>` (usando `source={{ uri: ... }}` para web ou `source={{ require('...') }}` para assets locais)
- `<div className="overflow-y-auto">` ➔ `<ScrollView>` ou `<FlatList>` (mandatório para listas de contatos ou diários)

### 1.2 Roteamento (React Navigation)
Abandone as condicionais de renderização de telas (`currentView === 'home'`). Implemente o `@react-navigation/native`.
- **Root Navigator (`createNativeStackNavigator`):**
  1. `OnboardingStack` (Telas de Splash, Auth e Anamnese Sensorial).
  2. `MainApp` (Acessível após o Onboarding).
- **MainApp Navigator (`createBottomTabNavigator`):**
  - **Aba Home:** Onde habita o Mixer de Sons, os Temas (Espaço, Dino, Carros) e atalhos rápidos.
  - **Aba Diário (DiaryView):** Onde ficam os rastreadores de humor, sono e geração de relatórios com o Gemini.
  - **Aba Comunidade:** Mapa e Refúgios Seguros.
  - **Aba Perfil (ProfileView):** Acesso a permissões, rede de apoio e configurações.
- **Modals/Overlays:** `PanicOverlay`, `EmergencySmsOverlay` e `GuardianAlertOverlay` DEVEM ser implementados como Modals com `presentation: 'transparentModal'` no Stack Navigator para se sobreporem a toda a aplicação imediatamente.

### 1.3 Regra de Ouro: Isolamento de Modos (Adulto vs Infantil)
**Tolerância ZERO para State Leakage.** 
O Modo Adulto é minimalista e escuro. O Modo Infantil é temático e lúdico. Ao realizar logout ou trocar de perfil, o estado do Redux/Zustand ou Context API DEVE ser redefinido (`initialState`). A árvore de navegação DEVE sofrer um `reset()`. Cores de fundo infantis não podem, sob nenhuma circunstância, "vazar" para o layout adulto.

---

## 2. Diretriz Crítica de Shaders e WebGL (Expo GL)

O aplicativo web depende fortemente de shaders extraídos do Shadertoy/21st.dev para relaxamento e foco. No React Native, o renderizador web (Canvas HTML) falhará.

**Comando de Execução:** Você OBRIGATORIAMENTE utilizará a trindade: `@react-three/fiber` (versão nativa), `three` e `expo-gl`. O componente `<Canvas>` será importado de `@react-three/fiber/native`.

Os códigos GLSL originais (Vertex e Fragment shaders) devem ser **preservados** e injetados em um `THREE.ShaderMaterial`.

Abaixo estão os códigos fontes exatos utilizados no front-end web atual. Extraia os shaders e reescreva o "wrapper" React para utilizar as primitivas nativas.

{shader_content}

---

## 3. Migração de Banco de Dados e Persistência Local

O projeto web original utiliza `localStorage` (para perfis e temas) e `IndexedDB` (para histórico de Diários/Humor). No ambiente mobile, essa abordagem é inaceitável.

**Implementação Obrigatória:**
1. **Preferências Simples (KV Storage):** Para configurações, temas, nome do usuário, permissões, utilize **AsyncStorage** (`@react-native-async-storage/async-storage`) ou, preferencialmente, **React Native MMKV** para acesso síncrono e veloz.
2. **Dados Estruturados e Diários (SQLite):** Todo o histórico de humor, métricas de sono, anotações de diário e "Resumos Gerados por IA" devem ser migrados do `IndexedDB` para um banco SQL local.
   - Utilize a biblioteca **`expo-sqlite`**.
   - **Esquema Básico Esperado (`diary_entries`):**
     - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
     - `user_email` (TEXT - para garantir o isolamento multitenant no dispositivo)
     - `date` (TEXT - ISO String)
     - `mood` (TEXT - 'happy', 'neutral', 'overwhelmed', etc.)
     - `sleep_hours` (REAL)
     - `text_entry` (TEXT)
     - `gemini_summary` (TEXT - o insight gerado pela IA)

---

## 4. Integração Gemini API (Análise de Diário e Regulação)

As chamadas ao Gemini (via `@google/genai`) são a espinha dorsal do suporte psicológico da aplicação (análise de crise, insights diários).

**Estratégia de Integração Mobile:**
- **Local da Chamada:** As requisições para resumir a semana do usuário ou analisar entradas de diário devem ocorrer preferencialmente através de um gateway/backend server (API routes, Cloud Functions).
- **Fallback Client-side (Se estritamente necessário no MVP):** Caso você deva acionar diretamente do app RN, você utilizará a API `fetch` padrão do React Native, conectando ao REST endpoint do Gemini (ou usando a SDK TypeScript) enviando o prompt instrucional de "Aja como um psicoterapeuta especialista em neurodivergência".
- **Gestão de Chaves:** Em NENHUMA hipótese faça hardcode da `GEMINI_API_KEY`. O app deve consumi-la via `process.env.EXPO_PUBLIC_GEMINI_API_KEY` injetado via Eas Build ou extrair de um `Expo SecureStore`.

---

## 5. Gestão de Assets, Ícones e Permissões

### 5.1 Ícones
Substitua a biblioteca web `lucide-react` imediatamente por **`lucide-react-native`**.
O agente deve se atentar que os ícones no RN exigem propriedades explícitas de `color` (string) e `size` (number), não sendo controlados por classes do Tailwind como `text-white w-6 h-6`.

### 5.2 Fontes Customizadas
A aplicação exige as fontes: `Poppins` e `Playfair Display`.
- Utilize a biblioteca `expo-font`.
- Crie um hook `useFonts` no `App.js`/`App.tsx` raiz (e retorne `null` ou um `<SplashScreen />` usando `expo-splash-screen` até o carregamento completo).

### 5.3 Mídias e Áudios flutuantes
- As imagens do tema infantil (Espaço) como `rocekt.png`, `planet-big.png`, devem ser movidas para a pasta `/assets` e requisitadas no código: `<Image source={{ require('../assets/rocekt.png') }} style={{ width: 100, height: 100 }} />`.
- Para o **Mixer de Áudios**, utilize o pacote **`expo-av`**. Inicialize as instâncias usando `Audio.Sound.createAsync()`.

### 5.4 Permissões (Hardware)
O fallback HTML5 para varrer permissões (`navigator.permissions`) será inteiramente **apagado**. 
Você deve usar obrigatoriamente as APIs de sistema do Expo na View "Permissões e Privacidade":
- Microfone: `expo-av` (`Audio.requestPermissionsAsync()`).
- Câmera: `expo-camera` (`Camera.requestCameraPermissionsAsync()`).
- Localização: `expo-location` (`Location.requestForegroundPermissionsAsync()`).
- Notificações: `expo-notifications` (`Notifications.requestPermissionsAsync()`).

---
**Fim das Diretrizes.**
Ao iniciar o trabalho, leia este documento inteiramente e aplique a arquitetura exata descrita acima.
"""

with open('README.md', 'w') as f:
    f.write(readme_template)

print("README.md gerado com exito.")
