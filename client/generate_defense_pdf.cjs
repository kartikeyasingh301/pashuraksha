const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: 'new'
        });
        const page = await browser.newPage();
        
        await page.goto('file:///C:/Users/KARTIKEYA/.gemini/antigravity/brain/bf8beb0e-bfae-4750-8605-cb1f8217d75c/presentation_defense.html', {
            waitUntil: 'networkidle0'
        });

        await page.pdf({
            path: 'C:\\Users\\KARTIKEYA\\.gemini\\antigravity\\brain\\bf8beb0e-bfae-4750-8605-cb1f8217d75c\\PashuSuraksha_Technical_Defense.pdf',
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
        });

        console.log('PDF successfully generated.');
        await browser.close();
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
})();
