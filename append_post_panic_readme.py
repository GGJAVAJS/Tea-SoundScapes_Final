import re

with open('README.md', 'r') as f:
    content = f.read()

new_section = """
---

## 17. Fluxo Pós-Crise: Termômetro de Humor (Avaliação SOS)

No Modo Infantil, a saída da tela SOS Pânico (`PanicOverlay.tsx`) possui um comportamento estrito atrelado ao **Filtro de Autonomia** (configurado na Etapa 8 da criação de conta). O Agente Antigravity DEVE respeitar essa condicional ao finalizar uma crise.

### 17.1 Lógica de Acionamento (Condicional)
Quando a criança conclui o exercício de respiração (HUD de Carros, Pterodáctilo voando ou Shader Espacial) e a crise é estabilizada:
- O agente deve checar a variável `childAutonomyFilter` (armazenada no estado global Zustand / MMKV).
- **Se `false` (Desligado):** O modal SOS Pânico fecha imediatamente. O aplicativo apenas registra um evento silencioso de "Crise" no banco de dados para os pais lerem depois.
- **Se `true` (Ligado):** A tela SOS Pânico NÃO fecha direto. Ela transiciona internamente para a view do **Termômetro de Humor Lúdico**, exibindo a pergunta: *"Como você se sente agora?"*.

### 17.2 UI/UX do Termômetro Pós-Crise por Tema
O Termômetro reaproveita as mecânicas de avaliação visual da aba Diário, sendo sobreposto como um *Glass Card* ou Modal imersivo:
- **Tema Espaço Sideral:** Exibe horizontalmente os 5 níveis de avatares (ex: do `alien_rage.png` ao `happy-astronaut.png`).
- **Tema Dinossauros:** Exibe os 5 avatares interativos da família T-Rex (ex: do `dinossaur_rage.png` ao `dinosaur_happy.png`).
- **Tema Carros (A Exceção de Assets):** Sem o uso de avatares PNG. A criança interage com componentes de **UI Nativos de Painel Analógico** (um slider/velocímetro visual ou medidor de temperatura do motor usando `react-native-reanimated`) para apontar o quão calma ela ficou após o exercício.

### 17.3 Ação Final e Persistência
Assim que a criança tocar na sua emoção atual:
1. O aplicativo aciona o `expo-sqlite` (ou camada de repositório).
2. Salva um registro na tabela `diary_entries` contendo a emoção escolhida, a tag de que ocorreu após um SOS Pânico, o timestamp e o `user_email`.
3. Ouve-se um *feedback* sonoro positivo de conclusão.
4. O Overlay de Pânico é totalmente desmontado (`unmount`), devolvendo a criança de forma suave (fade-out) para a tela em que ela estava (Home, Social, etc.).

"""

with open('README.md', 'a') as f:
    f.write(new_section)

print("Post-panic evaluation section appended successfully.")
