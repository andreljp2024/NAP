const fs = require('fs');
let code = fs.readFileSync('src/pages/PortalDashboard.tsx', 'utf8');

code = "import { Bell } from 'lucide-react';\nimport { usePushNotifications } from '../hooks/usePushNotifications';\n" + code;

fs.writeFileSync('src/pages/PortalDashboard.tsx', code);

let hookCode = fs.readFileSync('src/hooks/usePushNotifications.ts', 'utf8');
// Remove the vibrate line completely to appease TS
hookCode = hookCode.replace(/vibrate: \[200, 100, 200\] as any/g, '');
hookCode = hookCode.replace(/vibrate: \[200, 100, 200\]/g, '');
// Clean up trailing comma
hookCode = hookCode.replace(/badge: '\/pwa-maskable-512x512.png',/g, "badge: '/pwa-maskable-512x512.png'");

fs.writeFileSync('src/hooks/usePushNotifications.ts', hookCode);
console.log('Fixed dashboard imports and hook vibrate');
