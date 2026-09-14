import re

with open('src/views/HomeView.tsx', 'r') as f:
    content = f.read()

new_block = """                              if (kidsTheme === 'space') {
                                return (
                                  <input 
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={vol}
                                    onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                                    disabled={!isActive}
                                    className="w-full appearance-none bg-white/10 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[url('/rocekt.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rotate-90 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-[url('/rocekt.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rotate-90"
                                  />
                                );
                              }
                              if (kidsTheme === 'dino') {
                                return (
                                  <input 
                                    type="range"
                                    min="0" max="1" step="0.01"
                                    value={vol}
                                    onChange={(e) => handleVolumeChange(sound.id, parseFloat(e.target.value))}
                                    disabled={!isActive}
                                    className="w-full appearance-none bg-[#553100]/30 h-1.5 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[url('/dino_fofo.png')] [&::-webkit-slider-thumb]:bg-contain [&::-webkit-slider-thumb]:bg-center [&::-webkit-slider-thumb]:bg-no-repeat [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:bg-[url('/dino_fofo.png')] [&::-moz-range-thumb]:bg-contain [&::-moz-range-thumb]:bg-center [&::-moz-range-thumb]:bg-no-repeat [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                  />
                                );
                              }"""

content = re.sub(r'if \(kidsTheme === \'space\'\) \{\n\s*return \(\n\s*<input \n\s*type="range"\n\s*min="0" max="1" step="0\.01"\n\s*value=\{vol\}\n\s*onChange=\{\(e\) => handleVolumeChange\(sound\.id, parseFloat\(e\.target\.value\)\)\}\n\s*disabled=\{!isActive\}\n\s*className="w-full appearance-none bg-white/10 h-1\.5 rounded-full outline-none \[\&::-webkit-slider-thumb\][^>]+>\n\s*\);\n\s*\}', new_block, content)

with open('src/views/HomeView.tsx', 'w') as f:
    f.write(content)
