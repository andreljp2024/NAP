const fs = require('fs');
let code = fs.readFileSync('src/components/PortalLayout.tsx', 'utf8');

if (!code.includes('PWAInstallButton')) {
  code = code.replace(
    "import WebchatWidget from './WebchatWidget';",
    "import WebchatWidget from './WebchatWidget';\nimport { PWAInstallButton } from './PWAInstallButton';\nimport { usePushNotifications } from '../hooks/usePushNotifications';\nimport { Bell, BellOff, BellRing } from 'lucide-react';"
  );

  code = code.replace(
    "export default function PortalLayout() {",
    "export default function PortalLayout() {\n  const { isSupported, permission, requestPermission } = usePushNotifications();"
  );
  
  // Add PWAInstallButton and Bell to Mobile Header
  code = code.replace(
    '<div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-600">\n          JS\n        </div>',
    `<div className="flex items-center gap-3">
          {isSupported && permission !== 'granted' && (
            <button onClick={requestPermission} className="p-2 text-slate-500 hover:text-blue-600 transition-colors" title="Ativar Notificações">
              <Bell size={20} />
            </button>
          )}
          {permission === 'granted' && (
            <div className="p-2 text-blue-600" title="Notificações Ativas">
              <BellRing size={20} />
            </div>
          )}
          <PWAInstallButton />
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-600">
            JS
          </div>
        </div>`
  );
  
  // Add PWAInstallButton and Bell to Desktop Sidebar
  code = code.replace(
    '<nav className="flex-1 py-6 flex flex-col gap-1.5 px-4">',
    `<nav className="flex-1 py-6 flex flex-col gap-1.5 px-4">
          <div className="mb-4 px-2 flex flex-col gap-2">
            <PWAInstallButton />
            {isSupported && permission !== 'granted' && (
              <button 
                onClick={requestPermission} 
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
              >
                <Bell size={18} />
                Ativar Notificações
              </button>
            )}
          </div>`
  );

  fs.writeFileSync('src/components/PortalLayout.tsx', code);
  console.log('PortalLayout.tsx updated');
}
