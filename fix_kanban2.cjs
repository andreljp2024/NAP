const fs = require('fs');
let code = fs.readFileSync('src/pages/Kanban.tsx', 'utf8');

if (!code.includes('Tooltip')) {
  code = code.replace("import { DragDropContext", "import { Tooltip } from '../components/Tooltip';\nimport { DragDropContext");
}

const actionFind = `                    <button 
                      onClick={() => setMapTargetDeal(selectedDeal)}
                      className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-indigo-500/20"
                    >
                      <MapPin size={16} />
                      Despachar Técnico
                    </button>`;
                    
const actionReplace = `                    <Tooltip content="Ver localização no mapa e despachar rota" position="top">
                      <button 
                        onClick={() => setMapTargetDeal(selectedDeal)}
                        className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-indigo-500/20 w-full"
                      >
                        <MapPin size={16} />
                        Despachar Técnico
                      </button>
                    </Tooltip>`;

code = code.replace(actionFind, actionReplace);

const assumirFind = `                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    showToast('Conversa puxada para sua Caixa de Entrada (Inbox) com sucesso!');
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  Assumir Atendimento no Inbox
                </button>`;

const assumirReplace = `                <Tooltip content="Redireciona para o Inbox com o histórico deste cliente" position="top" className="flex-1">
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      showToast('Conversa puxada para sua Caixa de Entrada (Inbox) com sucesso!');
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Assumir Atendimento no Inbox
                  </button>
                </Tooltip>`;

code = code.replace(assumirFind, assumirReplace);

fs.writeFileSync('src/pages/Kanban.tsx', code);
