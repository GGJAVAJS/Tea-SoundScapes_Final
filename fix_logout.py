import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_logout = """onLogout={() => {
                  localStorage.removeItem('isLoggedIn');
                  localStorage.removeItem('currentUserEmail');
                  setCurrentUserEmail('');
                  setThemeMode('adult');
                  setKidsTheme(null);
                  setParentalPin('');
                  setActiveRefugeSound(null);
                  setIsLoggedIn(false);
                  setCurrentTab('home');
                  document.body.classList.remove('child-mode');
                }}"""

content = re.sub(r'onLogout=\{\(\) => \{\n\s*localStorage.removeItem\(\'isLoggedIn\'\);\n\s*setIsLoggedIn\(false\);\n\s*setCurrentTab\(\'home\'\);\n\s*\}\}', new_logout, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
