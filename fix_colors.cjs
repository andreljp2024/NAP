const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const colorMap = [
  // Backgrounds
  { regex: /bg-\[\#0b0f19\]/g, rep: 'bg-slate-50' },
  { regex: /bg-\[\#0d1321\]/g, rep: 'bg-white' },
  { regex: /bg-\[\#101726\]/g, rep: 'bg-white' },
  { regex: /bg-\[\#1a2333\]/g, rep: 'bg-slate-50' },
  { regex: /bg-\[\#1a1c33\]/g, rep: 'bg-white' },
  { regex: /from-\[\#101726\]/g, rep: 'from-white' },
  { regex: /bg-slate-800\/50/g, rep: 'bg-slate-50' },
  { regex: /bg-slate-800/g, rep: 'bg-slate-100' },
  { regex: /hover:bg-slate-800/g, rep: 'hover:bg-slate-200' },
  
  // Borders
  { regex: /border-slate-800\/60|border-slate-800\/40|border-slate-800|border-slate-700\/50|border-slate-700\/30|border-slate-700/g, rep: 'border-slate-200' },
  { regex: /border-indigo-500\/30|border-indigo-500\/20/g, rep: 'border-blue-200' },
  
  // Text
  { regex: /text-slate-200/g, rep: 'text-slate-900' },
  { regex: /text-slate-300|text-slate-400/g, rep: 'text-slate-600' },
  { regex: /font-bold text-white/g, rep: 'font-bold text-slate-900' },
  { regex: /font-bold text-slate-100/g, rep: 'font-bold text-slate-900' },
  { regex: /text-white/g, rep: 'text-white' },
  
  // Indigo -> Blue
  { regex: /indigo-400/g, rep: 'blue-600' },
  { regex: /indigo-500/g, rep: 'blue-600' },
  { regex: /indigo-600/g, rep: 'blue-700' },
  { regex: /indigo-900/g, rep: 'blue-100' },
  { regex: /indigo-100/g, rep: 'blue-800' },
  { regex: /indigo-200/g, rep: 'blue-700' },
  { regex: /indigo-300/g, rep: 'blue-600' },
  { regex: /from-indigo-500 to-purple-600/g, rep: 'bg-blue-600' },
  { regex: /from-indigo-500\/20 to-purple-500\/20/g, rep: 'bg-blue-50' },
  { regex: /bg-gradient-to-br from-blue-600/g, rep: 'bg-blue-600' },
  { regex: /bg-gradient-to-br bg-blue-50/g, rep: 'bg-blue-50' },
  
  // Semantic Colors
  { regex: /bg-red-500\/10 text-red-400 border border-red-500\/20/g, rep: 'bg-red-50 text-red-700 border border-red-200' },
  { regex: /bg-emerald-500\/10 text-emerald-400 border border-emerald-500\/20/g, rep: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  { regex: /bg-amber-500\/10 text-amber-400 border border-amber-500\/20/g, rep: 'bg-amber-50 text-amber-700 border border-amber-200' },
  
  { regex: /bg-emerald-500\/10 hover:bg-emerald-500\/20/g, rep: 'bg-emerald-50 hover:bg-emerald-100' },
  { regex: /bg-amber-500\/10 hover:bg-amber-500\/20/g, rep: 'bg-amber-50 hover:bg-amber-100' },
  { regex: /text-amber-400/g, rep: 'text-amber-600' },
  { regex: /border-amber-500\/20/g, rep: 'border-amber-200' },
  
  { regex: /text-emerald-400/g, rep: 'text-emerald-600' },
  { regex: /text-emerald-500/g, rep: 'text-emerald-600' },
  { regex: /border-emerald-500\/20|border-emerald-500\/30/g, rep: 'border-emerald-200' },

  { regex: /bg-blue-700 text-slate-600/g, rep: 'bg-blue-700 text-white' },
];

walk('./src/pages', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let oldContent = content;
    colorMap.forEach(map => {
      content = content.replace(map.regex, map.rep);
    });
    // some manual fixes for bad text-slate-600 replacement in buttons
    content = content.replace(/bg-blue-700 hover:bg-blue-600 text-slate-600/g, 'bg-blue-700 hover:bg-blue-600 text-white');
    content = content.replace(/bg-blue-700 text-slate-600 px-4/g, 'bg-blue-700 text-white px-4');
    
    if (content !== oldContent) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});

walk('./src/components', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let oldContent = content;
    colorMap.forEach(map => {
      content = content.replace(map.regex, map.rep);
    });
    content = content.replace(/bg-blue-700 hover:bg-blue-600 text-slate-600/g, 'bg-blue-700 hover:bg-blue-600 text-white');
    content = content.replace(/bg-blue-700 text-slate-600 px-4/g, 'bg-blue-700 text-white px-4');
    if (content !== oldContent) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});

