const fs = require('fs');
let code = fs.readFileSync('src/views/DiaryView.tsx', 'utf8');

code = code.replace(
  "startView?: 'registro' | 'analises';",
  "startView?: 'registro' | 'analises' | 'relatorios';"
);

code = code.replace(
  "const [activeTab, setActiveTab] = useState<'registro' | 'analises'>(startView);",
  "const [activeTab, setActiveTab] = useState<'registro' | 'analises' | 'relatorios'>(startView);"
);

fs.writeFileSync('src/views/DiaryView.tsx', code);
console.log('Success DiaryView types');
