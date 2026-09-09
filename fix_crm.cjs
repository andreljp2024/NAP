const fs = require('fs');
let code = fs.readFileSync('src/pages/CRM.tsx', 'utf8');

code = code.replace(/divide-slate-700\/50/g, 'divide-slate-200');

fs.writeFileSync('src/pages/CRM.tsx', code);
