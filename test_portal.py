import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Add import
if "createPortal" not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { createPortal } from 'react-dom';")

# Find the AnimatePresence block for Full Screen Player
full_player_start = r"{/\* Full Screen Endel-like Player \*/}\s*<AnimatePresence>"
full_player_end = r"        isFullPlayerOpen && activeRecipe && \([\s\S]*?className=\"fixed inset-0 z-\[60\][\s\S]*?             </motion\.div>\n\s*\)\n\s*\}\n\s*</AnimatePresence>"

# Let's just use string replacement carefully
start_idx = content.find("{/* Full Screen Endel-like Player */}")
if start_idx != -1:
    end_presence_idx = content.find("</AnimatePresence>", start_idx)
    end_presence_idx += len("</AnimatePresence>")
    
    player_block = content[start_idx:end_presence_idx]
    
    # We want to wrap the AnimatePresence in createPortal
    new_player_block = player_block.replace("<AnimatePresence>", "{createPortal(\n      <AnimatePresence>")
    new_player_block = new_player_block.replace("</AnimatePresence>", "</AnimatePresence>,\n      document.body\n    )}")
    
    content = content[:start_idx] + new_player_block + content[end_presence_idx:]
    
    with open('src/views/CommunityView.tsx', 'w') as f:
        f.write(content)
    print("Portal added!")
else:
    print("Could not find Full Screen Player block")
