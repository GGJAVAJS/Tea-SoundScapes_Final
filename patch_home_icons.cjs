const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const importTarget = "import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark } from 'lucide-react';";
const importReplacement = "import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark, Brain, Grid3x3, Moon, Bus, Baby, BookOpen } from 'lucide-react';";

if (code.includes(importTarget)) {
    code = code.replace(importTarget, importReplacement);
} else {
    console.log("import not found");
}

fs.writeFileSync('src/views/HomeView.tsx', code);
console.log("icons imported");
