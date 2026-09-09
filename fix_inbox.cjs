const fs = require('fs');
let code = fs.readFileSync('src/pages/Inbox.tsx', 'utf8');

code = code.replace(/text-slate-600 font-outfit/g, 'text-slate-900 font-outfit');

fs.writeFileSync('src/pages/Inbox.tsx', code);
