import re

with open('src/views/DiaryView.tsx', 'r') as f:
    content = f.read()

fuel_tank_component = """
const FuelTankMood = ({ mood }: { mood: string }) => {
  const config = {
    great: { level: 100, color: '#22c55e', text: 'F' },
    good: { level: 75, color: '#84cc16', text: '3/4' },
    neutral: { level: 50, color: '#eab308', text: '1/2' },
    bad: { level: 25, color: '#f97316', text: '1/4' },
    terrible: { level: 10, color: '#ef4444', text: 'E' },
  }[mood] || { level: 50, color: '#eab308', text: '1/2' };

  return (
    <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex flex-col items-center justify-end rounded-lg overflow-hidden bg-black/60 border-2 border-white/10 shrink-0">
       <div 
         className="absolute bottom-0 w-full transition-all duration-500" 
         style={{ height: `${config.level}%`, backgroundColor: config.color, opacity: 0.8 }}
       />
       <svg className="absolute inset-0 w-full h-full p-2 text-white/90 drop-shadow-md z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
         <path d="M3 22v-8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v8"/><path d="M14 22V4c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>
       </svg>
       {/* Small F and E markers */}
       {mood === 'great' && (
         <span className="absolute top-1 left-1 text-[8px] sm:text-[10px] font-bold text-white z-20">F</span>
       )}
       {mood === 'terrible' && (
         <span className="absolute bottom-1 left-1 text-[8px] sm:text-[10px] font-bold text-red-300 z-20">E</span>
       )}
    </div>
  );
};
"""

content = content.replace("const AstronautMood =", fuel_tank_component + "\nconst AstronautMood =")

# Also need to replace the rendering block in DiaryView
content = re.sub(
    r"\) : isDinoTheme \? \(\s*<img src=\{mood.id === 'great'.*? />\s*\) : \(\s*mood.emoji\s*\)",
    r") : isDinoTheme ? (\n                      <img src={mood.id === 'great' ? '/dinosaur_happy.png' : mood.id === 'good' ? '/dinosaur_smile.png' : mood.id === 'neutral' ? '/dinosaur_neutral.png' : mood.id === 'bad' ? '/dynosaurus_angry.png' : '/dinossaur_rage.png'} alt={mood.label} className=\"w-10 h-10 sm:w-14 sm:h-14 object-contain drop-shadow-md shrink-0\" />\n                    ) : isCarsTheme ? (\n                      <FuelTankMood mood={mood.id} />\n                    ) : (\n                      mood.emoji\n                    )",
    content
)

# And need to update the button's wrapper class logic to not force 'text-4xl' for cars
content = re.sub(
    r"isDinoTheme \? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'text-4xl'",
    r"(isDinoTheme || isCarsTheme) ? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'text-4xl'",
    content
)
content = re.sub(
    r"isDinoTheme \? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'w-12 h-12'",
    r"(isDinoTheme || isCarsTheme) ? 'w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center' : 'w-12 h-12'",
    content
)

with open('src/views/DiaryView.tsx', 'w') as f:
    f.write(content)
