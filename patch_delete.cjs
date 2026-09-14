const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf-8');

const oldDelete = `                     if (email) {
                       const usersData = localStorage.getItem('tea_users');
                       if (usersData) {
                         const users = JSON.parse(usersData);
                         const newUsers = users.filter((u: string) => u !== email);
                         localStorage.setItem('tea_users', JSON.stringify(newUsers));
                       }
                       localStorage.removeItem(\`onboardingData_\${email}\`);
                       localStorage.removeItem(\`onboardingCompleted_\${email}\`);
                       localStorage.removeItem(\`diaryRecords_\${email}\`);
                     }`;

const newDelete = `                     if (email) {
                       const usersData = localStorage.getItem('tea_users');
                       if (usersData) {
                         const users = JSON.parse(usersData);
                         const newUsers = users.filter((u: string) => u !== email);
                         localStorage.setItem('tea_users', JSON.stringify(newUsers));
                       }
                       // Hard delete all keys related to this email
                       const keysToRemove = [];
                       for (let i = 0; i < localStorage.length; i++) {
                         const key = localStorage.key(i);
                         if (key && (key.includes(email) || key.endsWith(email))) {
                           keysToRemove.push(key);
                         }
                       }
                       keysToRemove.forEach(k => localStorage.removeItem(k));
                     }`;

if (code.includes(oldDelete)) {
  code = code.replace(oldDelete, newDelete);
  fs.writeFileSync('src/views/ProfileView.tsx', code);
  console.log("Patched ProfileView delete logic");
} else {
  console.log("Could not find exact string to replace in ProfileView");
}
