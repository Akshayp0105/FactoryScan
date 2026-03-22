const fs = require('fs');

const featuresDir = path.join(__dirname, 'src', 'app', 'features');
const features = ['id-verification', 'document-watermark', 'refund-verification', 'review-scoring'];

features.forEach(feature => {
    const pagePath = path.join(__dirname, 'src', 'app', 'features', feature, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');

        // Note: handling Windows CRLF
        // The pattern aims to match:
        //   useEffect(() => {
        //     if (result && window.innerWidth <= 900) {
        //       setTimeout(() => {
        //         resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //       }, 100);
        //     }
        //   }, [result]);

        // Just do a simple generic remove that doesn't care about whitespace as much
        content = content.replace(/[\r\n\s]*useEffect\(\(\) => \{[\r\n\s]*if \(\w+ && window\.innerWidth <= 900\) \{[\s\S]*?\}, \[\w+\]\);/g, '');

        let match = '';
        if (feature === 'id-verification') match = 'result';
        if (feature === 'document-watermark') match = 'result';
        if (feature === 'refund-verification') match = 'result';
        if (feature === 'review-scoring') match = 'result';

        // Add it back after result
        content = content.replace(new RegExp(`(const \\[${match}, setResult\\] = useState[^\n\r]*;)`, 'g'), `$1\n\n  useEffect(() => {\n    if (${match} && window.innerWidth <= 900) {\n      setTimeout(() => {\n        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });\n      }, 100);\n    }\n  }, [${match}]);`);

        fs.writeFileSync(pagePath, content);
        console.log('Fixed ' + feature);
    }
});