const fs = require('fs');

// Fix CRM
let crmCode = fs.readFileSync('src/pages/CRM.tsx', 'utf8');
if (!crmCode.includes('Phone, ')) {
  crmCode = crmCode.replace(
    "import { Search, UserPlus, RefreshCw, Filter, MoreHorizontal, CheckCircle2, XCircle, X, Activity, FileText, Trello, Zap } from 'lucide-react';",
    "import { Search, UserPlus, RefreshCw, Filter, MoreHorizontal, CheckCircle2, XCircle, X, Activity, FileText, Trello, Zap, Phone } from 'lucide-react';"
  );
  fs.writeFileSync('src/pages/CRM.tsx', crmCode);
}

// Fix PortalDashboard
let pdCode = fs.readFileSync('src/pages/PortalDashboard.tsx', 'utf8');
if (!pdCode.includes('import { usePushNotifications } from')) {
  pdCode = pdCode.replace(
    "import { Wifi, CreditCard, HeadphonesIcon, Settings, Activity, Copy, Download, QrCode, AlertCircle, CheckCircle2, Loader2, Bell } from 'lucide-react';",
    "import { Wifi, CreditCard, HeadphonesIcon, Settings, Activity, Copy, Download, QrCode, AlertCircle, CheckCircle2, Loader2, Bell } from 'lucide-react';\nimport { usePushNotifications } from '../hooks/usePushNotifications';"
  );
}
if (!pdCode.includes('Bell } from \'lucide-react\'')) {
   pdCode = pdCode.replace(
    "import { Wifi, CreditCard, HeadphonesIcon, Settings, Activity, Copy, Download, QrCode, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';",
    "import { Wifi, CreditCard, HeadphonesIcon, Settings, Activity, Copy, Download, QrCode, AlertCircle, CheckCircle2, Loader2, Bell } from 'lucide-react';"
  );
}
fs.writeFileSync('src/pages/PortalDashboard.tsx', pdCode);

// Fix hook
let hookCode = fs.readFileSync('src/hooks/usePushNotifications.ts', 'utf8');
hookCode = hookCode.replace(
  'vibrate: [200, 100, 200]',
  'vibrate: [200, 100, 200] as any'
);
fs.writeFileSync('src/hooks/usePushNotifications.ts', hookCode);

console.log('Lint errors fixed');
