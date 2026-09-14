import re

with open('src/views/HomeView.tsx', 'r') as f:
    content = f.read()

# For the bass, mid, treble sliders:
# They have className={themeMode === 'child' && (kidsTheme === 'space' || kidsTheme === 'dino') ? "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[url('/et.png')] ... "

new_class = """className={
                                themeMode === 'child' && kidsTheme === 'space'
                                 ? "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[url('/et.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[url('/et.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                : themeMode === 'child' && kidsTheme === 'dino'
                                 ? "w-full appearance-none bg-white/10 h-1 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[url('/fossil_rex.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-[url('/fossil_rex.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
"""

content = re.sub(r'className=\{themeMode === \'child\' && \(kidsTheme === \'space\' \|\| kidsTheme === \'dino\'\)\s*\n\s*\?\s*"w-full appearance-none bg-white/10 h-1 rounded-full outline-none \[\&::-[^"]+"\s*\n', new_class, content)

with open('src/views/HomeView.tsx', 'w') as f:
    f.write(content)
