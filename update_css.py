import re

with open('src/index.css', 'r') as f:
    content = f.read()

content = content.replace('backdrop-filter: blur(12px);', 'backdrop-filter: blur(8px);')
content = content.replace('-webkit-backdrop-filter: blur(12px);', '-webkit-backdrop-filter: blur(8px);')

with open('src/index.css', 'w') as f:
    f.write(content)
