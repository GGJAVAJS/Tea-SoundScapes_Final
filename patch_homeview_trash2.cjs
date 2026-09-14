const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const targetImport = "import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark, Brain, Grid3x3, Moon, Bus, Baby, BookOpen } from 'lucide-react';";
const replImport = "import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark, Brain, Grid3x3, Moon, Bus, Baby, BookOpen, Trash2 } from 'lucide-react';";

code = code.replace(targetImport, replImport);
fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched trash2');
