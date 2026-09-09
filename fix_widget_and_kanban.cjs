const fs = require('fs');

// Fix WebchatWidget
let widget = fs.readFileSync('src/components/WebchatWidget.tsx', 'utf8');
widget = widget.replace(/hover:bg-white hover:scale-105 transition-all z-50/g, 'hover:bg-blue-600 hover:scale-105 transition-all z-50');
widget = widget.replace(/bg-white text-white p-4 flex justify-between/g, 'bg-white text-slate-900 p-4 flex justify-between border-b border-slate-200');
widget = widget.replace(/className="p-2 hover:bg-blue-600\/10 border border-blue-200 rounded-2xl transition-colors"/g, 'className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-2xl transition-colors"');
fs.writeFileSync('src/components/WebchatWidget.tsx', widget);

// Fix Kanban
let kanban = fs.readFileSync('src/pages/Kanban.tsx', 'utf8');
kanban = kanban.replace(/border-2 border-\[\#1a2333\]/g, 'border-2 border-slate-50');
fs.writeFileSync('src/pages/Kanban.tsx', kanban);
