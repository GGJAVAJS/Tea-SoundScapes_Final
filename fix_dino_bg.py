import re

with open('src/components/FloatingDinoBackground.tsx', 'r') as f:
    content = f.read()

# Modify component definition
content = content.replace("export const FloatingDinoBackground = React.memo(() => {", "export const FloatingDinoBackground = React.memo(({ showImages = true }: { showImages?: boolean }) => {")

# Wrap the contents in a conditional
start_div = r'      <div className="absolute inset-0 w-full max-w-md mx-auto">'
replacement = r"""      {showImages && (
        <div className="absolute inset-0 w-full max-w-md mx-auto">"""

content = content.replace(start_div, replacement)

end_div = r'      </div>\n    </div>'
replacement_end = r'      </div>\n      )}\n    </div>'
content = content.replace(end_div, replacement_end)

with open('src/components/FloatingDinoBackground.tsx', 'w') as f:
    f.write(content)
