const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src/lib/i18n/translations.ts'), 'utf8');
const lines = content.split('\n');

// Check bracket balance
let open = 0, close = 0;
for (const line of lines) {
  if (!line) continue;
  open += (line.match(/{/g) || []).length;
  close += (line.match(/}/g) || []).length;
}
console.log(`Open: ${open}, Close: ${close}, Diff: ${open - close}`);