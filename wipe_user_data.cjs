const fs = require('fs');
let code = fs.readFileSync('src/views/ProfileView.tsx', 'utf8');

const targetStr = `                     if (email) {
                       const usersData = localStorage.getItem('tea_users');
                       if (usersData) {
                         const users = JSON.parse(usersData);
                         const newUsers = users.filter((u: string) => u !== email);
                         localStorage.setItem('tea_users', JSON.stringify(newUsers));
                       }
                       localStorage.removeItem(\`onboardingCompleted_\${email}\`);
                       localStorage.removeItem(\`onboardingData_\${email}\`);
                       localStorage.removeItem(\`diaryRecords_\${email}\`);
                     }
                     localStorage.removeItem('currentUserEmail');
                     localStorage.removeItem('isLoggedIn');
                     window.location.reload();
                    }}
                    className="flex-1 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg"
                  >Sim, excluir</button>`;

const replStr = `                     if (email) {
                       const usersData = localStorage.getItem('tea_users');
                       if (usersData) {
                         const users = JSON.parse(usersData);
                         const newUsers = users.filter((u: string) => u !== email);
                         localStorage.setItem('tea_users', JSON.stringify(newUsers));
                       }
                       
                       // HARD DELETE - Wipe all keys associated with this user
                       const keysToRemove = [];
                       for (let i = 0; i < localStorage.length; i++) {
                         const key = localStorage.key(i);
                         if (key && key.includes(\`_\${email}\`)) {
                           keysToRemove.push(key);
                         }
                       }
                       keysToRemove.forEach(k => localStorage.removeItem(k));
                     }
                     localStorage.removeItem('currentUserEmail');
                     localStorage.removeItem('isLoggedIn');
                     window.location.reload();
                    }}
                    className="flex-1 py-2.5 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-lg"
                  >Sim, excluir</button>`;

code = code.replace(targetStr, replStr);

fs.writeFileSync('src/views/ProfileView.tsx', code);
