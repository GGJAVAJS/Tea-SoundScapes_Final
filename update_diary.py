import re

with open('src/views/DiaryView.tsx', 'r') as f:
    content = f.read()

# Insert isDinoTheme
if 'const isDinoTheme =' not in content:
    content = content.replace('const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend };', 'const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend };\n  const isDinoTheme = themeMode === \'child\' && kidsTheme === \'dino\';')

# Fix tab 1
content = content.replace(
    "`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'registro' ? 'bg-[#80F356]/25 text-white border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10'}`",
    "`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'registro' ? (isDinoTheme ? 'bg-[#80F356]/25 text-white border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 text-white border border-accent-blue/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isDinoTheme ? 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'text-gray-400 hover:text-accent-blue hover:bg-accent-blue/10')}`"
)

# Fix tab 2
content = content.replace(
    "`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'analises' ? 'bg-[#80F356]/25 text-[#80F356] border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10'}`",
    "`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'analises' ? (isDinoTheme ? 'bg-[#80F356]/25 text-[#80F356] border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 text-accent-blue border border-accent-blue/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isDinoTheme ? 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'text-gray-400 hover:text-accent-blue hover:bg-accent-blue/10')}`"
)

# Fix mood circle blur bg
content = content.replace(
    'className="absolute inset-0 bg-[#80F356]/40 rounded-full blur-md scale-150"',
    'className={`absolute inset-0 rounded-full blur-md scale-150 ${isDinoTheme ? \'bg-[#80F356]/40\' : \'bg-accent-blue/40\'}`}'
)

# Fix mood emoji border
content = content.replace(
    'className="relative z-10 block rounded-full border-2 border-[#80F356]/79 p-1 shadow-[0_0_15px_rgba(128,243,86,0.79)]"',
    'className={`relative z-10 block rounded-full border-2 p-1 ${isDinoTheme ? \'border-[#80F356]/79 shadow-[0_0_15px_rgba(128,243,86,0.79)]\' : \'border-accent-blue/79 shadow-[0_0_15px_rgba(56,189,248,0.5)]\'}`}'
)

# Fix triggers (it's twice: one for triggers, one for strategy)
content = content.replace(
    "`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTriggers.includes(t.id) \n                    ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' \n                    : 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]'}`",
    "`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTriggers.includes(t.id) \n                    ? (isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]')\n                    : (isDinoTheme ? 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]' : 'glass-card text-gray-300 border-white/10 hover:border-accent-blue/50 hover:text-accent-blue hover:bg-accent-blue/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]')}`"
)

content = content.replace(
    "`px-4 py-2 rounded-full text-sm font-medium transition-all ${strategy === s \n                    ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' \n                    : 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]'}`",
    "`px-4 py-2 rounded-full text-sm font-medium transition-all ${strategy === s \n                    ? (isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]')\n                    : (isDinoTheme ? 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]' : 'glass-card text-gray-300 border-white/10 hover:border-accent-blue/50 hover:text-accent-blue hover:bg-accent-blue/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.2)]')}`"
)

# Fix save button
content = content.replace(
    'className="py-4 w-full text-center font-medium text-lg mt-12 mb-32 text-white bg-[#80F356]/20 hover:bg-[#80F356]/30 border border-[#80F356]/79 shadow-[0_0_18px_rgba(128,243,86,0.4)] rounded-2xl relative overflow-hidden active:scale-95 transition-all"',
    'className={`py-4 w-full text-center font-medium text-lg mt-12 mb-32 text-white rounded-2xl relative overflow-hidden active:scale-95 transition-all ${isDinoTheme ? \'bg-[#80F356]/20 hover:bg-[#80F356]/30 border border-[#80F356]/79 shadow-[0_0_18px_rgba(128,243,86,0.4)]\' : \'bg-accent-blue hover:bg-accent-blue/80 shadow-[0_0_15px_rgba(56,189,248,0.4)]\'}`}'
)


with open('src/views/DiaryView.tsx', 'w') as f:
    f.write(content)
