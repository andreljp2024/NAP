const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace('<html lang="pt-BR" class="dark">', '<html lang="pt-BR">');
code = code.replace(/background-color: #0b0f19;/g, 'background-color: #f8fafc;');
code = code.replace(/color: #f1f5f9;/g, 'color: #0f172a;');
code = code.replace(/class="bg-\[\#0b0f19\] text-slate-200 selection:bg-indigo-500\/30"/g, 'class="bg-slate-50 text-slate-900 selection:bg-blue-600/30"');

const pwaHeadTags = `
    <meta name="theme-color" content="#1d4ed8" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Portal NAP" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
`;

code = code.replace('<title>NAP - Núcleo de Atendimento ao Provedor</title>', '<title>NAP - Núcleo de Atendimento ao Provedor</title>' + pwaHeadTags);

fs.writeFileSync('index.html', code);
