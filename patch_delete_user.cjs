const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf-8');

const regex = /const email = localStorage\.getItem\('currentUserEmail'\);\s*if \(email\) \{[\s\S]*?\}\s*localStorage\.removeItem\('currentUserEmail'\);\s*localStorage\.removeItem\('isLoggedIn'\);\s*window\.location\.reload\(\);/m;

const newLogic = `const email = localStorage.getItem('currentUserEmail');
                     if (email) {
                       const keysToRemove: string[] = [];
                       for (let i = 0; i < localStorage.length; i++) {
                         const key = localStorage.key(i);
                         if (key && (key.includes(email) || key.endsWith(email))) {
                           keysToRemove.push(key);
                         }
                       }
                       keysToRemove.forEach(k => localStorage.removeItem(k));
                       
                       // Remove from tea_users array
                       const usersStr = localStorage.getItem('tea_users');
                       if (usersStr) {
                         try {
                           let users = JSON.parse(usersStr);
                           if (Array.isArray(users)) {
                             users = users.filter(u => u.email !== email);
                             localStorage.setItem('tea_users', JSON.stringify(users));
                           }
                         } catch (e) {}
                       }

                       // Clear IndexedDB reports
                       try {
                         const reports = await getReportsByUser(email);
                         for (const report of reports) {
                           await deleteReport(report.id);
                         }
                       } catch (e) {
                         console.error("Erro ao deletar relatorios:", e);
                       }
                       
                       // For hard start, also clear any other global state that might have leaked
                       localStorage.removeItem('themeMode');
                       localStorage.removeItem('kidsTheme');
                     }
                     localStorage.removeItem('currentUserEmail');
                     localStorage.removeItem('isLoggedIn');
                     window.location.reload();`;

code = code.replace(regex, newLogic);
fs.writeFileSync('src/views/ProfileView.tsx', code);
