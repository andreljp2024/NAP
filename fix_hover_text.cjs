const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let oldContent = content;
    
    // Fix buttons with light background hover that still have hover:text-white
    content = content.replace(/hover:text-white hover:bg-slate-50/g, 'hover:text-slate-900 hover:bg-slate-100');
    content = content.replace(/hover:text-white hover:bg-slate-100/g, 'hover:text-slate-900 hover:bg-slate-200');
    content = content.replace(/hover:bg-slate-100 hover:text-white/g, 'hover:bg-slate-200 hover:text-slate-900');
    content = content.replace(/hover:text-white/g, 'hover:text-slate-900');
    
    // Re-fix primary blue buttons that MIGHT have been accidentally broken by the above regex
    content = content.replace(/bg-blue-700 hover:bg-blue-600 text-slate-900/g, 'bg-blue-700 hover:bg-blue-600 text-white');
    content = content.replace(/bg-blue-700 hover:bg-blue-600 text-white hover:text-slate-900/g, 'bg-blue-700 hover:bg-blue-600 text-white');
    content = content.replace(/bg-blue-600 text-white hover:text-slate-900/g, 'bg-blue-600 text-white');
    content = content.replace(/text-slate-900 bg-blue-600/g, 'text-white bg-blue-600');
    content = content.replace(/text-white hover:text-slate-900/g, 'text-white');
    
    // Fix any remaining text-slate-500 that should be 600 or 400 for better contrast or subtlety
    // Actually, text-slate-500 is fine for labels and placeholders. Let's just fix the hover issues.

    // Fix other components that might have font-bold text-white on light bg
    content = content.replace(/font-bold text-white/g, 'font-bold text-slate-900');
    // But then primary buttons might have font-bold text-slate-900. Let's fix that specific case
    content = content.replace(/text-slate-900 px-4 py-2 rounded/g, 'text-white px-4 py-2 rounded');
    content = content.replace(/text-slate-900 px-6 py-2/g, 'text-white px-6 py-2');
    content = content.replace(/text-slate-900 px-5 py-2/g, 'text-white px-5 py-2');
    content = content.replace(/bg-blue-700 hover:bg-blue-600 text-slate-900/g, 'bg-blue-700 hover:bg-blue-600 text-white');

    if (content !== oldContent) {
      fs.writeFileSync(filePath, content);
      console.log('Updated: ' + filePath);
    }
  }
});
