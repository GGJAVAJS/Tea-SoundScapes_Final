import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# I will replace `{createPortal(\n      <AnimatePresence>` back to `<AnimatePresence>`
content = content.replace("{createPortal(\n      <AnimatePresence>", "<AnimatePresence>")
content = content.replace("                      </AnimatePresence>,\n      document.body\n    )}", "                      </AnimatePresence>")

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
