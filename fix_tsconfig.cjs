const fs = require('fs');
let code = fs.readFileSync('tsconfig.json', 'utf8');
let json = JSON.parse(code);
if (!json.compilerOptions.types) {
  json.compilerOptions.types = ["vite/client", "vite-plugin-pwa/client"];
} else if (!json.compilerOptions.types.includes("vite-plugin-pwa/client")) {
  json.compilerOptions.types.push("vite-plugin-pwa/client");
}
fs.writeFileSync('tsconfig.json', JSON.stringify(json, null, 2));
