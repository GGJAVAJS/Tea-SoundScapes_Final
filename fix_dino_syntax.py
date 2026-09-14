with open('src/components/FloatingDinoBackground.tsx', 'r') as f:
    content = f.read()

if ")}\n    </div>\n  );\n});" not in content:
    content = content.replace("    </div>\n  );\n});", "      )}\n    </div>\n  );\n});")
    with open('src/components/FloatingDinoBackground.tsx', 'w') as f:
        f.write(content)
