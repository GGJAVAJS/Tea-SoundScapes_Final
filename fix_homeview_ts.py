import re

with open('src/views/HomeView.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (kidsTheme === 'dino') { thumbEmoji = '☄️'; }", "")

with open('src/views/HomeView.tsx', 'w') as f:
    f.write(content)
