const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  "import { Check, Download, Lightbulb, ChevronDown } from 'lucide-react';",
  "import { Check, Download, Lightbulb, ChevronDown, Share2, Trash2, FileText, Filter } from 'lucide-react';\nimport { saveReport, getReportsByUser, deleteReport, Report } from '../lib/reportDB';"
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success Imports');
