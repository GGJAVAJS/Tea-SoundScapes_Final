import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

content = content.replace('className="w-full h-full overflow-y-auto pb-48 relative bg-[#060b13] z-10"', 'className="w-full h-full overflow-y-auto pb-48 relative bg-[#060b13]"')

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
