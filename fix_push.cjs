const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const missingVars = `
  // --- Push Notifications Gateway (PWA Web Push) ---
  interface PushSubscriptionRecord {
    id: string;
    endpoint: string;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
    created_at: string;
  }
  let pushSubscriptions: PushSubscriptionRecord[] = [];
  let pushNotificationsHistory: any[] = [];
`;

const target = `  app.post("/api/push/subscribe", (req, res) => {`;
code = code.replace(target, missingVars + '\n' + target);

fs.writeFileSync('server.ts', code);
