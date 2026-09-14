import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Remove the import from the middle
content = content.replace("import { DinoProfileBackground } from '../components/DinoProfileBackground';\n\n", "")

# Add the import at the top
content = "import { DinoProfileBackground } from '../components/DinoProfileBackground';\n" + content

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
