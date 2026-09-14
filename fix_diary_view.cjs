const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

const replacement = `function AnalisesView({ isDinoTheme, isSpaceTheme, isCarsTheme,
  stats, chartData, topStrategies, topTriggers, heatmapData, 
  diasComCrises, diasSemCrises, timelineRecords, records }: { 
  stats: any, chartData: any[], 
  topStrategies: {label: string, count: number, dates: number[]}[], 
  topTriggers: {label: string, count: number, p: number}[], 
  heatmapData: number[][],
  diasComCrises: any[], diasSemCrises: any[], timelineRecords: DiaryRecord[],
  records: DiaryRecord[], isDinoTheme?: boolean, isSpaceTheme?: boolean, isCarsTheme?: boolean }) {

  const printRef = useRef<HTMLDivElement>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [aiInsights, setAiInsights] = useState<{userInsight?: string, therapistSummary?: string}>({});
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/analyze-diary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ records })
        });
        if (response.ok) {
          const data = await response.json();
          setAiInsights(data);
        }
      } catch (err) {
        console.error('Failed to fetch AI insights', err);
      } finally {
        setIsLoadingInsights(false);
      }
    };
    if (records.length > 0) {
      fetchInsights();
    } else {
      setIsLoadingInsights(false);
    }
  }, [records]);
`;

code = code.replace(
  /function AnalisesView\(\{[\s\S]*?const \[isExporting, setIsExporting\] = useState\(false\);/,
  replacement
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success');
