import re

with open('src/views/HomeView.tsx', 'r') as f:
    content = f.read()

# Replace bg-[#553100]/40 with bg-[#553100] for the specific line
old_line = "              : (themeMode === 'child' && kidsTheme === 'dino' ? 'bg-[#553100]/40 text-[#80F356] hover:brightness-110 border border-[#553100]' : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 border border-accent-blue/20')"
new_line = "              : (themeMode === 'child' && kidsTheme === 'dino' ? 'bg-[#553100] text-[#80F356] hover:brightness-110 border border-[#553100]' : 'bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 border border-accent-blue/20')"

content = content.replace(old_line, new_line)

with open('src/views/HomeView.tsx', 'w') as f:
    f.write(content)
