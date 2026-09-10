const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import SuperAdmin from './pages/SuperAdmin';", "import SuperAdmin from './pages/SuperAdmin';\nimport Helpers from './pages/Helpers';");

const routesFind = `<Route path="configuracoes" element={<SuperAdmin />} />`;
const routesReplace = `<Route path="configuracoes" element={<SuperAdmin />} />\n              <Route path="ajuda" element={<Helpers />} />`;
code = code.replace(routesFind, routesReplace);

fs.writeFileSync('src/App.tsx', code);
