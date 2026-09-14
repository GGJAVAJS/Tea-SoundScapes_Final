import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Revert the broken one
bad_block = """                      </AnimatePresence>,
      document.body
    )}"""
content = content.replace(bad_block, "                      </AnimatePresence>")

bad_start = """      {/* Full Screen Endel-like Player */}
      {createPortal(
      <AnimatePresence>
        {isFullPlayerOpen"""

content = content.replace(bad_start, """      {/* Full Screen Endel-like Player */}
      <AnimatePresence>
        {isFullPlayerOpen""")

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)

