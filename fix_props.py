import re

with open('src/views/DiaryView.tsx', 'r') as f:
    content = f.read()

# Update RegistroView props
content = content.replace(
    'function RegistroView({ onSave }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void }) {',
    'function RegistroView({ onSave, isDinoTheme }: { onSave: (intensity: number, moodId: string, triggers: string[], strategy: string, observacao: string) => void, isDinoTheme?: boolean }) {'
)
content = content.replace(
    '<RegistroView onSave={handleSaveForm} />',
    '<RegistroView onSave={handleSaveForm} isDinoTheme={isDinoTheme} />'
)

# Update AnalisesView props
content = content.replace(
    'function AnalisesView({ ',
    'function AnalisesView({ isDinoTheme, '
)
# Add isDinoTheme to interface
content = re.sub(
    r'records: DiaryRecord\[\]\s*\}\) \{',
    r'records: DiaryRecord[], isDinoTheme?: boolean }) {',
    content
)

content = content.replace(
    '<AnalisesView stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} />',
    '<AnalisesView isDinoTheme={isDinoTheme} stats={stats} chartData={chartData} topStrategies={topStrategies} topTriggers={topTriggers} heatmapData={heatmapData} diasComCrises={diasComCrises} diasSemCrises={diasSemCrises} timelineRecords={timelineRecords} records={records} />'
)

with open('src/views/DiaryView.tsx', 'w') as f:
    f.write(content)
