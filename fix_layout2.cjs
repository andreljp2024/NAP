const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!code.includes("import { Tooltip }")) {
  code = code.replace("import { NavLink", "import { Tooltip } from './Tooltip';\nimport { NavLink");
}

fs.writeFileSync('src/components/Layout.tsx', code);
