import re

with open('src/views/DiaryView.tsx', 'r') as f:
    content = f.read()

# Fix triggers (using isSelected instead of selectedTriggers.includes)
content = content.replace(
    """                  isSelected 
                    ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' 
                    : 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]'""",
    """                  isSelected 
                    ? (isDinoTheme ? 'bg-[#80F356]/20 border border-[#80F356]/79 text-[#80F356] shadow-[0_0_12px_rgba(128,243,86,0.5)]' : 'bg-accent-blue/20 border border-accent-blue/79 text-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.5)]')
                    : (isDinoTheme ? 'glass-card text-gray-300 border-white/10 hover:border-[#80F356]/79 hover:text-[#80F356] hover:bg-[#80F356]/10 hover:shadow-[0_0_10px_rgba(128,243,86,0.3)]' : 'glass-card text-gray-300 border-white/10 hover:border-accent-blue/79 hover:text-accent-blue hover:bg-accent-blue/10 hover:shadow-[0_0_10px_rgba(56,189,248,0.3)]')"""
)

# And fix the Check icon for Triggers
content = content.replace(
    '{isSelected && <Check className="w-4 h-4 text-[#80F356]" />}',
    '{isSelected && <Check className={`w-4 h-4 ${isDinoTheme ? \'text-[#80F356]\' : \'text-accent-blue\'}`} />}'
)

with open('src/views/DiaryView.tsx', 'w') as f:
    f.write(content)
