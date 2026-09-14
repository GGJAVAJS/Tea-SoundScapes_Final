import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Revert DataStream return
content = re.sub(r'return \(\n\s*<>\n\s*\{themeMode === \'child\' && kidsTheme === \'dino\' && <DinoProfileBackground />\}\n\s*<motion\.div\n\s*key=\{i\}', r'return (\n          <motion.div\n            key={i}', content)

# Revert RecipeCard return
content = re.sub(r'return \(\n\s*<>\n\s*\{themeMode === \'child\' && kidsTheme === \'dino\' && <DinoProfileBackground />\}\n\s*<motion\.div\n\s*whileTap', r'return (\n    <motion.div\n      whileTap', content)

# Revert closing tag for CommunityView if I added one incorrectly
content = content.replace('    </motion.div>\n    </>\n  );\n}', '  );\n}')

# Now add the DinoProfileBackground ONLY to the main CommunityView return
main_return = r'  return (\n    <div className="w-full h-full overflow-y-auto pb-48 relative">'
replacement = r"""  return (
    <>
      {themeMode === 'child' && kidsTheme === 'dino' && <DinoProfileBackground />}
      <div className="w-full h-full overflow-y-auto pb-48 relative z-10">"""
content = content.replace(main_return, replacement)

# Add closing fragment to the very end
content = re.sub(r'      </AnimatePresence>\n    </div>\n  \);\n\}', '      </AnimatePresence>\n      </div>\n    </>\n  );\n}', content)

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
