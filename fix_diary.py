import re

with open('src/views/DiaryView.tsx', 'r') as f:
    content = f.read()

# Make sure isDinoTheme is defined
if 'const isDinoTheme' not in content:
    content = content.replace('const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend };', "const stats = { mood: moodEmoji, crises: totalCrises, goodDays, trend };\n  const isDinoTheme = themeMode === 'child' && kidsTheme === 'dino';")

# 1. Tabs
content = re.sub(
    r"`flex-1 py-2 text-sm font-medium rounded-full transition-all \$\{activeTab === 'registro' \? 'bg-\[#80F356\]/25 text-white border border-\[#80F356\]/79 shadow-\[0_0_12px_rgba\(128,243,86,0\.5\)\]' : 'text-gray-400 hover:text-\[#80F356\] hover:bg-\[#80F356\]/10'}`",
    r"`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'registro' ? (isDinoTheme ? 'bg-[#80F356]/25 text-white border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 text-white border border-accent-blue/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isDinoTheme ? 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'text-gray-400 hover:text-accent-blue hover:bg-accent-blue/10')}`",
    content
)

content = re.sub(
    r"`flex-1 py-2 text-sm font-medium rounded-full transition-all \$\{activeTab === 'analises' \? 'bg-\[#80F356\]/25 text-\[#80F356\] border border-\[#80F356\]/79 shadow-\[0_0_12px_rgba\(128,243,86,0\.5\)\]' : 'text-gray-400 hover:text-\[#80F356\] hover:bg-\[#80F356\]/10'}`",
    r"`flex-1 py-2 text-sm font-medium rounded-full transition-all ${activeTab === 'analises' ? (isDinoTheme ? 'bg-[#80F356]/25 text-[#80F356] border border-[#80F356]/79 shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 text-accent-blue border border-accent-blue/50 shadow-[0_0_12px_rgba(56,189,248,0.3)]') : (isDinoTheme ? 'text-gray-400 hover:text-[#80F356] hover:bg-[#80F356]/10' : 'text-gray-400 hover:text-accent-blue hover:bg-accent-blue/10')}`",
    content
)

# 2. Mood Blur
content = re.sub(
    r'className="absolute inset-0 bg-\[#80F356\]/40 rounded-full blur-md scale-150"',
    r'className={`absolute inset-0 rounded-full blur-md scale-150 ${isDinoTheme ? \'bg-[#80F356]/40\' : \'bg-accent-blue/40\'}`}',
    content
)

# 3. Mood selected ring
content = re.sub(
    r'className="relative z-10 block rounded-full border-2 border-\[#80F356\]/79 p-1 shadow-\[0_0_15px_rgba\(128,243,86,0\.79\)\]"',
    r'className={`relative z-10 block rounded-full border-2 p-1 ${isDinoTheme ? \'border-[#80F356]/79 shadow-[0_0_15px_rgba(128,243,86,0.79)]\' : \'border-accent-blue/79 shadow-[0_0_15px_rgba(56,189,248,0.5)]\'}`}',
    content
)

# 4. Mood hover ring
content = re.sub(
    r'className="p-1 block rounded-full hover:border hover:border-\[#80F356\]/79 hover:shadow-\[0_0_10px_rgba\(128,243,86,0\.6\)\] transition-all"',
    r'className={`p-1 block rounded-full hover:border transition-all ${isDinoTheme ? \'hover:border-[#80F356]/79 hover:shadow-[0_0_10px_rgba(128,243,86,0.6)]\' : \'hover:border-accent-blue/79 hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]\'}`}',
    content
)

# 5. Slider
content = re.sub(
    r'className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-\[#80F356\] hover:border hover:border-\[#80F356\]/79 transition-colors"',
    r'className={`w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer transition-colors ${isDinoTheme ? \'accent-[#80F356] hover:border hover:border-[#80F356]/79\' : \'accent-accent-blue hover:border hover:border-accent-blue/79\'}`}',
    content
)

content = re.sub(
    r'className="hover:text-\[#80F356\]/79 transition-colors cursor-pointer"',
    r'className={`transition-colors cursor-pointer ${isDinoTheme ? \'hover:text-[#80F356]/79\' : \'hover:text-accent-blue/79\'}`}',
    content
)

# 6. Triggers and Strategies
content = re.sub(
    r"`px-4 py-2 rounded-full text-sm font-medium transition-all \$\{selectedTriggers\.includes\(t\.id\) \s*\?\s*'bg-\[#80F356\]/20 border border-\[#80F356\]/79 text-\[#80F356\] shadow-\[0_0_12px_rgba\(128,243,86,0\.5\)\]'\s*:\s*'glass-card text-gray-300 border-white/10 hover:border-\[#80F356\]/79 hover:text-\[#80F356\] hover:bg-\[#80F356\]/10 hover:shadow-\[0_0_10px_rgba\(128,243,86,0\.3\)\]'\}`",
    r"`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTriggers.includes(t.id) ? (isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isDinoTheme ? 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]' : 'glass-card text-gray-300 border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]')}`",
    content
)

content = re.sub(
    r"`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 \$\{\s*isSelected\s*\?\s*'bg-\[#80F356\]/20 border border-\[#80F356\]/79 text-\[#80F356\] shadow-\[0_0_12px_rgba\(128,243,86,0\.5\)\]'\s*:\s*'glass-card text-gray-300 border-white/10 hover:border-\[#80F356\]/79 hover:text-\[#80F356\] hover:bg-\[#80F356\]/10 hover:shadow-\[0_0_10px_rgba\(128,243,86,0\.3\)\]'\s*\}`",
    r"`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isSelected ? (isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]') : (isDinoTheme ? 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]' : 'glass-card text-gray-300 border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]')}`",
    content
)

# 7. Check icons
content = re.sub(
    r'className="w-4 h-4 text-\[#80F356\]"',
    r'className={`w-4 h-4 ${isDinoTheme ? \'text-[#80F356]\' : \'text-accent-blue\'}`}',
    content
)

# 8. Text area
content = re.sub(
    r'className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:border-\[#80F356\]/79 focus:ring-1 focus:ring-\[#80F356\]/79 hover:border-\[#80F356\]/50 transition-colors"',
    r'className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none transition-colors ${isDinoTheme ? \'focus:border-[#80F356]/79 focus:ring-1 focus:ring-[#80F356]/79 hover:border-[#80F356]/50\' : \'focus:border-accent-blue/79 focus:ring-1 focus:ring-accent-blue/79 hover:border-accent-blue/50\'}`}',
    content
)

# 9. Save button
content = re.sub(
    r'className="py-4 w-full text-center font-medium text-lg mt-12 mb-32 text-white bg-\[#80F356\]/20 hover:bg-\[#80F356\]/30 border border-\[#80F356\]/79 shadow-\[0_0_18px_rgba\(128,243,86,0\.4\)\] rounded-2xl relative overflow-hidden active:scale-95 transition-all"',
    r'className={`py-4 w-full text-center font-medium text-lg mt-12 mb-32 text-white rounded-2xl relative overflow-hidden active:scale-95 transition-all ${isDinoTheme ? \'bg-[#80F356]/20 hover:bg-[#80F356]/30 border border-[#80F356]/79 shadow-[0_0_18px_rgba(128,243,86,0.4)]\' : \'bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/79 shadow-[0_0_18px_rgba(56,189,248,0.4)]\'}`}',
    content
)

with open('src/views/DiaryView.tsx', 'w') as f:
    f.write(content)

