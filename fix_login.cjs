const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');
code = code.replace(
  "import { Lock, Mail, Server, ShieldCheck, Loader2 } from 'lucide-react';",
  "import { Lock, Mail, Server, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';"
);
fs.writeFileSync('src/pages/Login.tsx', code);
