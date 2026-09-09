const fs = require('fs');
let code = fs.readFileSync('src/pages/Automacoes.tsx', 'utf8');

code = code.replace(
  /bg-\[radial-gradient\(#1e293b_1px,transparent_1px\)\]/g, 
  'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]'
);

// SVG path colors from dark to light
code = code.replace(/stroke="#334155"/g, 'stroke="#94a3b8"');

fs.writeFileSync('src/pages/Automacoes.tsx', code);
console.log('Automacoes.tsx fixed pattern');
