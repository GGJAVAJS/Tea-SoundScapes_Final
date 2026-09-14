import re

with open('src/views/ProfileView.tsx', 'r') as f:
    content = f.read()

# Add isDinoTheme definition
if 'const isDinoTheme' not in content:
    content = content.replace('const [avatarUrl, setAvatarUrl] = useState<string | null>(null);', 
                              'const [avatarUrl, setAvatarUrl] = useState<string | null>(null);\n  const isDinoTheme = themeMode === \'child\' && kidsTheme === \'dino\';')

# Replace background color
content = content.replace("style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}", 
                          "style={{ backgroundColor: isDinoTheme ? '#553100' : 'rgba(255,255,255,0.05)' }}")

with open('src/views/ProfileView.tsx', 'w') as f:
    f.write(content)
