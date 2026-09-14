const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const targetState = '  const [isPublishOverlayOpen, setIsPublishOverlayOpen] = useState(false);';
const replState = `  const [isPublishOverlayOpen, setIsPublishOverlayOpen] = useState(false);
  const [favoriteMixes, setFavoriteMixes] = useState<any[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user_favorite_mixes_local');
      if (stored) setFavoriteMixes(JSON.parse(stored));
    } catch(e) {}
  }, []);
  const saveFavorite = (mix: any) => {
    const updated = [...favoriteMixes, mix];
    setFavoriteMixes(updated);
    localStorage.setItem('user_favorite_mixes_local', JSON.stringify(updated));
  };`;

code = code.replace(targetState, replState);
fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched state');
