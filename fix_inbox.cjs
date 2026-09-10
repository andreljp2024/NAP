const fs = require('fs');
let code = fs.readFileSync('src/pages/Inbox.tsx', 'utf8');

if (!code.includes('Tooltip')) {
  code = code.replace("import { \n  Search", "import { Tooltip } from '../components/Tooltip';\nimport { \n  Search");
}

const sendPixFind = `                    <button 
                      onClick={handleSendPixToChat}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all  flex items-center gap-1"
                      title="Copiar e colar PIX diretamente no chat"
                    >
                      <Copy size={12} />
                      <span>Enviar PIX</span>
                    </button>`;
                    
const sendPixReplace = `                    <Tooltip content="Gera o código e joga no chat" position="top">
                      <button 
                        onClick={handleSendPixToChat}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all  flex items-center gap-1"
                      >
                        <Copy size={12} />
                        <span>Enviar PIX</span>
                      </button>
                    </Tooltip>`;

code = code.replace(sendPixFind, sendPixReplace);

const desbloqueioFind = `                  <button 
                    onClick={handleDesbloqueio48h}
                    className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 "
                  >
                    <ShieldCheck size={13} className="text-amber-700" />
                    <span>Desbloqueio em Confiança (48h)</span>
                  </button>`;
                  
const desbloqueioReplace = `                  <Tooltip content="Libera 48h de conexão no NAS/MikroTik" position="top" className="w-full">
                    <button 
                      onClick={handleDesbloqueio48h}
                      className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 "
                    >
                      <ShieldCheck size={13} className="text-amber-700" />
                      <span>Desbloqueio em Confiança (48h)</span>
                    </button>
                  </Tooltip>`;

code = code.replace(desbloqueioFind, desbloqueioReplace);


const kickFind = `                  <button 
                    onClick={handleKickRadius}
                    className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Power size={12} />
                    Reiniciar ONU
                  </button>`;
                  
const kickReplace = `                  <Tooltip content="Envia um PoD (Packet of Disconnect) no Radius" position="top" className="flex-1">
                    <button 
                      onClick={handleKickRadius}
                      className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Power size={12} />
                      Reiniciar ONU
                    </button>
                  </Tooltip>`;

code = code.replace(kickFind, kickReplace);

fs.writeFileSync('src/pages/Inbox.tsx', code);
