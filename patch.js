const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src', 'app', 'features');
const features = ['id-verification', 'document-watermark', 'refund-verification', 'review-scoring'];

features.forEach(feature => {
    const pagePath = path.join(featuresDir, feature, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');
        
        // Add imports
        if (!content.includes('useRef')) {
            content = content.replace(/import { useState } from 'react';/, "import { useState, useRef, useEffect } from 'react';");
            content = content.replace(/import { useState,/g, "import { useState, useRef, useEffect,");
        }
        
        // Add ref
        if (!content.includes('resultRef')) {
            content = content.replace(/(export default function \w+\(\) \{)/, "$1\n  const resultRef = useRef<HTMLDivElement>(null);\n");
        }

        // Find result var
        let resultVar = 'result';
        if (feature === 'document-watermark') resultVar = 'watermarkResult';
        if (feature === 'review-scoring') resultVar = 'score';

        // Add useEffect
        if (!content.includes('resultRef.current?.scrollIntoView')) {
            content = content.replace(/(const resultRef = useRef<HTMLDivElement>\(null\);\n)/, `$1\n  useEffect(() => {\n    if (${resultVar} && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [${resultVar}]);\n`);
        }

        // Update BackButton
        if (!content.includes('styles.backButtonWrapper')) {
            content = content.replace(/<BackButton \/>/g, `<div className={styles.backButtonWrapper}>\n        <BackButton />\n      </div>`);
        }

        // Update resultCol to use ref
        content = content.replace(/<div className=\{styles\.resultCol\}>/g, `<div className={styles.resultCol} ref={resultRef}>`);
        
        fs.writeFileSync(pagePath, content);
        console.log('Updated ' + pagePath);
    }

    const cssPath = path.join(featuresDir, feature, 'page.module.css');
    if (fs.existsSync(cssPath)) {
        let cssContent = fs.readFileSync(cssPath, 'utf8');
        
        if (!cssContent.includes('.backButtonWrapper')) {
            cssContent += '\n\n.backButtonWrapper {\n  align-self: flex-start;\n  margin-bottom: -1rem;\n}\n';
        }

        if (!cssContent.includes('@media (max-width: 480px)')) {
            cssContent += '\n\n@media (max-width: 480px) {\n  .container {\n    padding: 1.5rem 1rem;\n    gap: 1.5rem;\n  }\n  .title {\n    font-size: 1.75rem;\n  }\n  .mainContent {\n    gap: 1.5rem;\n  }\n  .actionBtn {\n    font-size: 1rem;\n    height: 3rem;\n  }\n}\n';
        }
        
        fs.writeFileSync(cssPath, cssContent);
        console.log('Updated ' + cssPath);
    }
});