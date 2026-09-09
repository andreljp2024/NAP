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
    
    // Replace hard dark shadows with subtle light theme shadows
    content = content.replace(/shadow-black\/\d{2}|shadow-black\/5/g, 'shadow-sm');
    content = content.replace(/shadow-black/g, 'shadow-sm');
    content = content.replace(/shadow-xl/g, 'shadow-md');
    content = content.replace(/shadow-2xl/g, 'shadow-lg');
    
    if (content !== oldContent) {
      fs.writeFileSync(filePath, content);
      console.log('Updated shadows: ' + filePath);
    }
  }
});
