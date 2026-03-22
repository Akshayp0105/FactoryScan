const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, 'src', 'app', 'features');
const features = ['id-verification', 'document-watermark', 'refund-verification', 'review-scoring'];

features.forEach(feature => {
    const pagePath = path.join(featuresDir, feature, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        let content = fs.readFileSync(pagePath, 'utf8');

        // Remove the duplicate
        content = content.replace(/import \{ useState, useRef, useEffect \} from 'react';[\r\n]+/, '');
        content = content.replace(/import React, \{ useState \} from "react";/, 'import React, { useState, useRef, useEffect } from "react";');

        fs.writeFileSync(pagePath, content);
        console.log('Cleaned imports in ' + feature);
    }
});