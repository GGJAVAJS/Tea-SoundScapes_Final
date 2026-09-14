import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

content = content.replace(r"\'child\'", "'child'")
content = content.replace(r"\'dino\'", "'dino'")

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
