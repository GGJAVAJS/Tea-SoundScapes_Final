const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
if (!code.includes('@media print')) {
  code += `
@media print {
  .hide-on-print {
    display: none !important;
  }
  .print\\:block {
    display: block !important;
  }
  .print\\:mb-8 {
    margin-bottom: 2rem !important;
  }
  .print\\:p-6 {
    padding: 1.5rem !important;
  }
  .print\\:border {
    border-width: 1px !important;
  }
  .print\\:border-gray-300 {
    border-color: #d1d5db !important;
  }
  .print\\:rounded-2xl {
    border-radius: 1rem !important;
  }
}
`;
  fs.writeFileSync('src/index.css', code);
}
console.log('Success');
