const fs = require('fs');
let code = fs.readFileSync('src/views/HomeView.tsx', 'utf8');

const targetStr = `        </button>
      </div>`;
const replStr = `        </button>
      </div>
      )}`;

code = code.replace(targetStr, replStr);
fs.writeFileSync('src/views/HomeView.tsx', code);
console.log('patched close');
