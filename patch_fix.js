const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src', 'app', 'features');
const features = ['id-verification', 'document-watermark', 'refund-verification', 'review-scoring'];

features.forEach(feature => {
    const pagePath = path.join(featuresDir, feature, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');

        // Fix missing imports
        if (content.includes('import { useState }')) {
            content = content.replace(/import\s*\{\s*useState\s*\}\s*from\s*['"]react['"];/, "import { useState, useRef, useEffect } from 'react';");
        } else if (content.includes('import { useState')) {
            if (!content.includes('useRef')) {
                content = content.replace(/import\s*\{\s*useState(.*)\}\s*from\s*['"]react['"];/, "import { useState, useRef, useEffect$1} from 'react';");
            }
        } else if (content.includes('import React')) {
            content = content.replace(/import React(.*)from\s*['"]react['"];/, "import React, { useState, useRef, useEffect } from 'react';");
        } else {
             // Just add it if completely missing
             if(!content.includes('useRef')) {
                 if (content.match(/import.*from 'react';/)) {
                      content = content.replace(/(import.*from 'react';)/, "import { useState, useRef, useEffect } from 'react';\n$1");
                 } else if (content.match(/import.*from "react";/)) {
                      content = content.replace(/(import.*from "react";)/, "import { useState, useRef, useEffect } from 'react';\n$1");
                 } else {
                      content = "import { useState, useRef, useEffect } from 'react';\n" + content;
                 }
             }
        }

        // Always remove the badly placed useEffect block first
        const badEffectRegex = /^\s*useEffect\(\(\) => \{\n\s*if \(\w+ && window\.innerWidth <= 900\) \{\n\s*setTimeout\(\(\) => \{\n\s*resultRef\.current\?\.scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\);\n\s*\}, 100\);\n\s*\}\n\s*\}, \[\w+\]\);\n/m;
        
        let match = content.match(/useEffect\(\(\) => \{\s*if \((\w+) &&/);
        let resultVar = 'result';
        if (match) {
            resultVar = match[1];
        }

        // Just remove all useEffects matching scrolling logic
        content = content.replace(/\s*useEffect\(\(\) => \{[\s\S]*?(?:scrollIntoView)[\s\S]*?\}, \[\w+\]\);\n/g, '\n');

        // Now find the useState block for result and insert the useEffect AFTER it
        const stateDeclaration = `const [${resultVar}, setResult] = useState<any>(null);`;
        const replacement = `${stateDeclaration}\n\n  useEffect(() => {\n    if (${resultVar} && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [${resultVar}]);\n`;
        
        // Some files might have slightly different state declaration
        if (content.includes(`const [${resultVar}, setResult] = useState<any>(null);`)) {
            content = content.replace(`const [${resultVar}, setResult] = useState<any>(null);`, replacement);
        } else if (content.includes(`const [${resultVar}, setResult]`)) {
            // catch all
            content = content.replace(new RegExp(`(const \\[${resultVar}, setResult\\] = useState.*?;)`), `$1\n\n  useEffect(() => {\n    if (${resultVar} && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [${resultVar}]);\n`);
        } else if (content.includes(`const [resultReady, setResultReady] = useState(false);`)) {
            content = content.replace(/(const \[resultReady, setResultReady\] = useState\(false\);)/, `$1\n\n  useEffect(() => {\n    if (resultReady && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [resultReady]);\n`);
        }

        fs.writeFileSync(pagePath, content);
        console.log('Fixed ' + pagePath);
    }
});