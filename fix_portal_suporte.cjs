const fs = require('fs');
let code = fs.readFileSync('src/pages/PortalSuporte.tsx', 'utf8');

code = code.replace(/bg-emerald-500\/10/g, 'bg-emerald-50');
code = code.replace(/bg-blue-600\/10/g, 'bg-blue-50');
code = code.replace(/shadow-md shadow-sm/g, 'shadow-md');

fs.writeFileSync('src/pages/PortalSuporte.tsx', code);
