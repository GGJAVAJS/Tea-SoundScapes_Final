import re

def fix_bg(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Modify component definition
    content = re.sub(r'export const (\w+) = React\.memo\(\(\) => \{', r'export const \1 = React.memo(({ showImages = true }: { showImages?: boolean }) => {', content)
    
    # Wrap images block
    start_div = r'      <div className="absolute inset-0 w-full max-w-md mx-auto">'
    replacement = r"""      {showImages && (
        <div className="absolute inset-0 w-full max-w-md mx-auto">"""
    
    content = content.replace(start_div, replacement)
    
    end_div = r'      </div>\n    </div>'
    replacement_end = r'      </div>\n      )}\n    </div>'
    content = content.replace(end_div, replacement_end)
    
    with open(filename, 'w') as f:
        f.write(content)

fix_bg('src/components/FloatingSpaceBackground.tsx')
fix_bg('src/components/FloatingCarsBackground.tsx')
