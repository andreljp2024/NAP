const fs = require('fs');
let code = fs.readFileSync('src/pages/PortalDashboard.tsx', 'utf8');

if (!code.includes('usePushNotifications')) {
  code = code.replace(
    "import { Wifi, CreditCard, HeadphonesIcon, Settings, Activity, Copy, Download, QrCode, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';",
    "import { Wifi, CreditCard, HeadphonesIcon, Settings, Activity, Copy, Download, QrCode, AlertCircle, CheckCircle2, Loader2, Bell } from 'lucide-react';\nimport { usePushNotifications } from '../hooks/usePushNotifications';"
  );

  code = code.replace(
    "export default function PortalDashboard() {",
    "export default function PortalDashboard() {\n  const { simulatePush } = usePushNotifications();"
  );
  
  code = code.replace(
    '<QuickAction icon={<Copy />} label="Comprovantes" />',
    `<QuickAction 
          icon={<Bell />} 
          label="Testar Push" 
          onClick={() => simulatePush('Aviso NAP', 'A sua conexão está operando perfeitamente!')}
        />`
  );
  
  code = code.replace(
    'function QuickAction({ icon, label }: { icon: React.ReactNode, label: string }) {',
    'function QuickAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {'
  );
  
  code = code.replace(
    '<button className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg shadow-sm flex flex-col items-center justify-center gap-4 hover:border-blue-600/50 hover:bg-slate-50 hover:-translate-y-1 transition-all group">',
    '<button onClick={onClick} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-lg shadow-sm flex flex-col items-center justify-center gap-4 hover:border-blue-600/50 hover:bg-slate-50 hover:-translate-y-1 transition-all group">'
  );
  
  fs.writeFileSync('src/pages/PortalDashboard.tsx', code);
  console.log('PortalDashboard.tsx updated');
}
