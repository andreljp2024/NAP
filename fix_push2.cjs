const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const missingVars = `
  // --- Push Notifications Gateway (PWA Web Push) ---
  interface PushSubscriptionRecord {
    id: string;
    endpoint: string;
    cliente_id?: string;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
    created_at: string;
  }
`;

const oldVars = `  // --- Push Notifications Gateway (PWA Web Push) ---
  interface PushSubscriptionRecord {
    id: string;
    endpoint: string;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
    created_at: string;
  }`;

code = code.replace(oldVars, missingVars);
fs.writeFileSync('server.ts', code);
