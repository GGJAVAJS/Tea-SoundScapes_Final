import os

missing_shader_files = [
    'src/components/ui/MathematicalVisualizer.tsx',
    'src/components/ui/light-speed.tsx',
    'src/components/ui/Nucleus.tsx',
    'src/components/ui/NatureLandscapeShader.tsx',
    'src/components/ui/water-shader.tsx',
    'src/components/ui/fire-shader.tsx',
    'src/components/ui/rain-shader.tsx',
    'src/components/ui/UniverseWithinShader.tsx',
    'src/components/ui/SpaceBloomShader.tsx',
    'src/components/ui/space-panic-shader.tsx'
]

shader_content = "\n\n### ARQUIVOS COMPLEMENTARES DE SHADERS (WebGL / Shadertoy)\n\n"
appended_any = False

for file in missing_shader_files:
    if os.path.exists(file):
        appended_any = True
        with open(file, 'r') as f:
            shader_content += f"#### Original: `{os.path.basename(file)}`\n```tsx\n{f.read()}\n```\n\n"
    else:
        # Tenta capitalização ou sem extensão
        alt = file.replace('Nucleus', 'nucleus')
        if os.path.exists(alt):
            appended_any = True
            with open(alt, 'r') as f:
                shader_content += f"#### Original: `{os.path.basename(alt)}`\n```tsx\n{f.read()}\n```\n\n"

if appended_any:
    with open('README.md', 'a') as f:
        f.write(shader_content)
    print("Remaining shaders appended successfully!")
else:
    print("Could not find the remaining shaders.")
