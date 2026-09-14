import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_community = """              <CommunityView 
                themeMode={themeMode}
                kidsTheme={kidsTheme}
              />"""

content = re.sub(r'<\s*CommunityView\s*/>', new_community, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
