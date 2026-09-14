const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<HomeView/g, '<HomeView key="home"');
code = code.replace(/<GuardianView/g, '<GuardianView key="guardian"');
code = code.replace(/<CommunityView/g, '<CommunityView key="community"');
code = code.replace(/<DiaryView/g, '<DiaryView key="diary"');
code = code.replace(/<ProfileView/g, '<ProfileView key="profile"');

// Fix potential duplicate keys if there were multiple <DiaryView> in App.tsx (like the postCrisisDiary)
// But wait, the post crisis diary uses <DiaryView> directly, let's just make sure it doesn't break.
// Actually, using key="home" etc is fine because they are in separate branches.

fs.writeFileSync('src/App.tsx', code);
