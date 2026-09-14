import re

with open('src/views/CommunityView.tsx', 'r') as f:
    content = f.read()

# Add props to CommunityView
props_interface = """import { DinoProfileBackground } from '../components/DinoProfileBackground';

export interface CommunityViewProps {
  themeMode?: 'adult' | 'child';
  kidsTheme?: 'dino' | 'space' | 'cars' | 'animals' | 'magic' | null;
}

export function CommunityView({ themeMode, kidsTheme }: CommunityViewProps) {"""

content = re.sub(r'export function CommunityView\(\) \{', props_interface, content)

# Add isDinoTheme variable
dino_var = """  const [combinedRecipes, setCombinedRecipes] = useState<MixRecipe[]>(MOCK_RECIPES);
  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';"""

content = re.sub(r'  const \[combinedRecipes, setCombinedRecipes\] = useState<MixRecipe\[\]>\(MOCK_RECIPES\);', dino_var, content)

# Add backgrounds
bg_markup = """  return (
    <>
      {themeMode === 'child' && kidsTheme === 'dino' && <DinoProfileBackground />}
      <motion.div"""

content = re.sub(r'  return \(\n\s*<motion\.div', bg_markup, content)
content = re.sub(r'    </motion\.div>\n  \);\n\}', '    </motion.div>\n    </>\n  );\n}', content)

with open('src/views/CommunityView.tsx', 'w') as f:
    f.write(content)
