const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src', 'app', 'features');
const features = ['id-verification', 'document-watermark', 'refund-verification', 'review-scoring'];

features.forEach(feature => {
    const pagePath = path.join(featuresDir, feature, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');

        // It injected literal \n instead of newlines, so let's clean that up
        content = content.replace(/\\n/g, '\n');

        fs.writeFileSync(pagePath, content);
        console.log('Cleaned ' + feature);
    }
});