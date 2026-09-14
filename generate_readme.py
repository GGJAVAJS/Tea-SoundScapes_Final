import os
import glob

readme_content = """# TEA SoundScapes - Arquitetura e Documentação de Migração (React para React Native)

Este documento foi elaborado especificamente para o agente **Antigravity** (ou outro engenheiro de software) responsável pela migração deste ecossistema web (React/Vite) para um aplicativo mobile nativo (React Native/Expo).

Aqui você encontrará toda a estrutura, regras de negócio arquiteturais (estritas), gerenciamento de estado e os códigos GLSL dos Shaders 3D utilizados.

---

## 1. Visão Geral da Arquitetura e Regras de Negócio OBRIGATÓRIAS

### 1.1 Isolamento Rigoroso de Modos (Adulto vs Infantil)
A aplicação possui dois modos principais:
- **Modo Adulto:** Design System padrão, escuro, minimalista. **NUNCA** deve herdar estilos infantis, cores vibrantes, assets lúdicos ou shaders interativos infantis.
- **Modo Infantil:** Ambiente lúdico, engajador. Possui 3 sub-temas independentes:
  - `dino` (Dinossauros - tons terrosos, assets de floresta/dinos).
  - `space` (Espaço Sideral - tons escuros, estrelas, planetas, foguetes flutuantes).
  - `cars` (Carros - tons de pista, amarelo/preto).

**REGRA DE OURO DA MIGRAÇÃO (STATE LEAKAGE):**
Ao fazer logout ou alternar contas, **TODO** o estado global e a árvore de renderização devem ser completamente desmontados (unmount) e resetados ao `initialState`. O design de um tema não pode "vazar" como fundo (background-color) ou overlay para outro. No React Native, use Contextos separados ou garanta a remontagem de rotas (Reset Navigation State) ao deslogar.

### 1.2 Estrutura do Estado (Local/Cloud)
A versão React Web atual utiliza `localStorage` fortemente para persistência offline-first, indexada pelo email do usuário (ex: `currentUserEmail`, `onboardingData_${email}`).
- Na migração, utilize **AsyncStorage** ou **MMKV** para React Native.
- O histórico de relatórios (reports) utiliza `IndexedDB` no Web (`reportDB`). No React Native, prefira **SQLite** (ex: `expo-sqlite`) ou WatermelonDB.

---

## 2. Tecnologias e Bibliotecas Utilizadas (Web Atual -> Equivalente RN)

| Web (React/Vite) | Equivalente React Native / Expo |
| :--- | :--- |
| Tailwind CSS / CSS Modules | NativeWind / StyleSheet |
| Framer Motion (`motion/react`) | React Native Reanimated 3 |
| React Router (View swap via State) | React Navigation (Stack / Tab) |
| `@react-three/fiber` & `three` | `@react-three/fiber/native` + `expo-gl` |
| `lucide-react` | `lucide-react-native` |
| `navigator.mediaDevices` / Permissions | `expo-camera`, `expo-location`, `expo-permissions` |

---

## 3. Assets e Fontes
- **Tipografia:** 
  - Títulos: `Poppins`, `Playfair Display`.
  - Corpo: `Plus Jakarta Sans`, `Inter`.
  - No React Native, utilizar `expo-font` para injetar essas fontes personalizadas.
- **Imagens 2D Flutuantes (Espaço):** O componente `FloatingSpaceBackground` utiliza assets `.png` (ex: `planet-big.png`, `planet2.png`, `moon.png`, `meteor.png`, `satellite.png`, `rocekt.png`, `asteroide.png`, `estrela_cadente.png`). Estas imagens são animadas com translações e rotações suaves.

---

## 4. Shaders e WebGL (Códigos Fonte)

O aplicativo Web usa `@react-three/fiber` para renderizar efeitos complexos e imersivos para acalmar o usuário. Abaixo estão os códigos principais dos shaders que deverão ser portados usando `expo-gl` ou `@react-three/fiber/native`.

"""

shaders_to_extract = [
    'src/components/ui/MistyLakeShader.tsx',
    'src/components/ui/NightCloudsShader.tsx',
    'src/components/ui/PinkNoiseShader.tsx',
    'src/components/ui/quantum-nebula.tsx',
    'src/components/ui/SoundNebulaShader.tsx'
]

for file_path in shaders_to_extract:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            code = f.read()
            readme_content += f"### {os.path.basename(file_path)}\n"
            readme_content += f"```tsx\n{code}\n```\n\n"
            
readme_content += """
---
## 5. Mapeamento de Telas (Views)

1. **AuthView / OnboardingView:** Telas de login e anamnese sensorial (configuração de permissões, preferências de som e locais de crise).
2. **HomeView:** Dashboard principal. No modo adulto, exibe o tocador (Mixer) e widgets de diário rápidos. No modo infantil, renderiza os cenários (Espaço, Dino, etc.).
3. **DiaryView:** Diário e rastreador de humor e sono.
4. **CommunityView:** Mapa de refúgios e lista da Rede de Apoio.
5. **ProfileView:** Aba "EU", contendo edições do perfil, configurações da Rede de Apoio, e a aba de **Permissões e Privacidade** (Camera, Location, Mic, Notifications).
6. **PanicOverlay / GuardianAlertOverlay / EmergencySmsOverlay:** Overlays de nível mais alto do DOM (usar Modals no React Native) para disparos de SOS de Pânico e SMS de emergência.

## 6. Lógica de Permissões Nativa
Para a migração, preste muita atenção na aba de **Privacidade**.
No React web, fizemos fallbacks complexos usando `navigator.permissions` e `enumerateDevices()`. 
No React Native, **substitua completamente** por:
- `expo-camera.requestCameraPermissionsAsync()`
- `expo-location.requestForegroundPermissionsAsync()`
- `expo-notifications.requestPermissionsAsync()`
- `expo-av.Audio.requestPermissionsAsync()` (Microfone)

---
**Antigravity**, boa sorte na migração! Lembre-se: o isolamento lógico das variáveis de tema e do modo (adulto/criança) ao trocar de usuário é a sua prioridade máxima. Não deixe estilos vazarem entre as sessões.
"""

with open('README.md', 'w') as f:
    f.write(readme_content)

print("README.md gerado com sucesso!")
