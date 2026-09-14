const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

// 1. Add sensoryProfileText to MainProfile props type
code = code.replace(
  "onLogout?: () => void, isDinoTheme?: boolean }",
  "onLogout?: () => void, isDinoTheme?: boolean, sensoryProfileText: string }"
);

// 2. Destructure sensoryProfileText in MainProfile
code = code.replace(
  "function MainProfile({ setSubView, avatarUrl, setAvatarUrl, userName, contactsCount, onLogout, isDinoTheme }:",
  "function MainProfile({ setSubView, avatarUrl, setAvatarUrl, userName, contactsCount, onLogout, isDinoTheme, sensoryProfileText }:"
);

// 3. Pass sensoryProfileText to MainProfile from ProfileView
code = code.replace(
  "<MainProfile setSubView={setSubView} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} userName={userName} contactsCount={contacts.length} onLogout={onLogout} isDinoTheme={isDinoTheme} />",
  "<MainProfile setSubView={setSubView} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} userName={userName} contactsCount={contacts.length} onLogout={onLogout} isDinoTheme={isDinoTheme} sensoryProfileText={sensoryProfileText} />"
);

fs.writeFileSync('src/views/ProfileView.tsx', code);
