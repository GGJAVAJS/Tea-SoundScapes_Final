import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Replace the end of RecipeCard
content = re.sub(r'      <div className="absolute right-4 top-4 z-20 opacity-80">\s*\{isThisPlaying \? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />\}\s*</div>\s*\);\s*\}', r'      <div className="absolute right-4 top-4 z-20 opacity-80">\n        {isThisPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}\n      </div>\n    </motion.div>\n  );\n}', content)

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
