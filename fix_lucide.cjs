const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const target = "import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark } from 'lucide-react';";
const replacement = "import { CloudRain, Wind, Activity, Plus, ShieldAlert, MoreVertical, X, SlidersHorizontal, Flame, Droplets, Bird, Trees, ChevronDown, Eye, EyeOff, Pause, Play, Bookmark, Brain, Grid3x3, Moon, Bus, Baby, BookOpen } from 'lucide-react';";

if (code.includes(target)) {
    code = code.replace(target, replacement);
    console.log("imported lucide icons");
} else {
    console.log("target not found");
}

fs.writeFileSync('src/views/HomeView.tsx', code);
