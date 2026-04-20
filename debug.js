const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, 'src/lib/i18n/translations.ts'), 'utf8');
const lines = content.split('\n');

// Check line 415 bytes
const line = lines[414];
console.log('Line 415:', line);
console.log('Hex:', Buffer.from(line).toString('hex'));