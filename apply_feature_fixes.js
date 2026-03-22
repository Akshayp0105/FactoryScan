const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src', 'app', 'features');
const features = ['id-verification', 'document-watermark', 'refund-verification', 'review-scoring'];

features.forEach(feature => {
    const pagePath = path.join(featuresDir, feature, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');

        // 1. imports
        if (content.includes('import { useState }')) {
            content = content.replace(/import\s*\{\s*useState\s*\}\s*from\s*['"]react['"];/, "import { useState, useRef, useEffect } from 'react';");
        } else if (content.includes('import { useState')) {
            if (!content.includes('useRef')) {
                content = content.replace(/import\s*\{\s*useState(.*)\}\s*from\s*['"]react['"];/, "import { useState, useRef, useEffect$1} from 'react';");
            }
        } else {
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

        // 2. resultRef
        if (!content.includes('resultRef')) {
            content = content.replace(/(export default function \w+\(\) \{)/, "$1\n  const resultRef = useRef<HTMLDivElement>(null);\n");
        }

        // 3. auto-scroll
        let resultVar = 'result';
        if (content.includes(`const [watermarkResult,`)) resultVar = 'watermarkResult';
        if (content.includes(`const [score,`)) resultVar = 'score';

        if (!content.includes('resultRef.current?.scrollIntoView')) {
            // Find the state var definition
            const r = new RegExp(`(const \\[${resultVar}, setResult\\] = useState<any>\\(null\\);)`);
            if (content.match(r)) {
                 content = content.replace(r, `$1\n\n  useEffect(() => {\n    if (${resultVar} && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [${resultVar}]);\n`);
            } else {
                 const r2 = new RegExp(`(const \\[${resultVar}, .*?\\] = useState[^\n\r]*;)`);
                 content = content.replace(r2, `$1\n\n  useEffect(() => {\n    if (${resultVar} && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [${resultVar}]);\n`);
            }
        }

        // 4. BackButton
        if (!content.includes('styles.backButtonWrapper')) {
            content = content.replace(/<BackButton \/>/g, `<div className={styles.backButtonWrapper}>\n        <BackButton />\n      </div>`);
        }

        // 5. resultCol ref
        content = content.replace(/<div className=\{styles\.resultCol\}>/g, `<div className={styles.resultCol} ref={resultRef}>`);

        fs.writeFileSync(pagePath, content);
        console.log('Fixed ' + pagePath);
    }
});