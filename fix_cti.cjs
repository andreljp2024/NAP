const fs = require('fs');
let code = fs.readFileSync('src/components/CTIReverso.tsx', 'utf8');

code = code.replace(/text-white font-outfit/g, 'text-slate-900 font-outfit');

fs.writeFileSync('src/components/CTIReverso.tsx', code);
