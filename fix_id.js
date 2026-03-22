const fs = require('fs');

const path = 'src/app/features/id-verification/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// remove all useEffects for scrolling
content = content.replace(/\s*useEffect\(\(\) => \{\n\s*if \(\w+ && window\.innerWidth <= 900\) \{\n\s*setTimeout\(\(\) => \{\n\s*resultRef\.current\?\.scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\);\n\s*\}, 100\);\n\s*\}\n\s*\}, \[\w+\]\);\n/g, '\n');

// specifically for review-scoring as well, wait, review-scoring was already fixed properly maybe?
fs.writeFileSync(path, content);
