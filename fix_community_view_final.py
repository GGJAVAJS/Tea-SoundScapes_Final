import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'  return \(\n\s*<div className="w-full h-full overflow-y-auto pb-48 relative">',
    r'  return (\n    <>\n      {themeMode === \'child\' && kidsTheme === \'dino\' && <DinoProfileBackground />}\n      <div className="w-full h-full overflow-y-auto pb-48 relative z-10">',
    content
)

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
