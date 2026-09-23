const fs = require('fs');
const path = require('path');

function replaceAllInFile(filePath, regex, replacement) {
  const fullPath = path.join(__dirname, 'src', filePath);
  if (fs.existsSync(fullPath)) {
    let code = fs.readFileSync(fullPath, 'utf8');
    code = code.replace(regex, replacement);
    fs.writeFileSync(fullPath, code, 'utf8');
  }
}

['pages/farmer/Dashboard.jsx', 'pages/farmer/Advisory.jsx', 'pages/farmer/ReportForm.jsx'].forEach(file => {
  replaceAllInFile(file, /<Layout title="(.*?)"(.*?)>/g, `<Layout title="$1" lang={lang} setLang={setLang} $2>`);
  replaceAllInFile(file, /<Layout(.*?)title="(.*?)"(.*?)>/g, `<Layout$1title="$2" lang={lang} setLang={setLang}$3>`);
  
  if (!fs.readFileSync(path.join(__dirname, 'src', file), 'utf8').includes('lang={lang}')) {
     replaceAllInFile(file, /<Layout(.*?)>/, `<Layout lang={lang} setLang={setLang} $1>`);
  }

  // Remove the Language Switcher safely
  replaceAllInFile(file, /\{\/\*\s*Language Switcher\s*\*\/\}\s*<div[^>]*>\s*<div[^>]*>[\s\S]*?<\/select>\s*<\/div>\s*<\/div>/g, '');
  replaceAllInFile(file, /<div style=\{\{\s*position:\s*["']absolute["'],\s*top:\s*["']16px["'],\s*right:\s*["']16px["'][\s\S]*?<\/select>\s*<\/div>/g, '');
});

// Advisory video regex
const videoHTML = `<div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", marginBottom: "16px", background: "#000", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!showVideo ? (
            <>
              <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=600&q=80" alt="Livestock Health" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
              <button onClick={() => setShowVideo(true)} style={{ zIndex: 1, padding: "12px 24px", background: "var(--brand-600)", color: "white", border: "none", borderRadius: "var(--radius-btn)", fontWeight: "600", cursor: "pointer" }}>Watch Video</button>
            </>
          ) : (
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Advisory Video" frameBorder="0" allowFullScreen></iframe>
            {/* TODO: Supply an India-relevant video URL for livestock advisory */}
          )}
        </div>`;

replaceInFile = replaceAllInFile;
replaceInFile('pages/farmer/Advisory.jsx',
  /const \[lang, setLang\] = useState\('en'\);/g,
  `const [lang, setLang] = useState('en');\n  const [showVideo, setShowVideo] = useState(false);`
);

replaceAllInFile('pages/farmer/Advisory.jsx',
  /<iframe width="100%" height="200" src=".*?" title="YouTube video player" frameBorder="0" allow=".*?" allowFullScreen style=\{\{ borderRadius: "12px", marginBottom: "16px" \}\}><\/iframe>/g,
  videoHTML
);

// Also apply the time utilities logic to Dashboard
replaceInFile('pages/farmer/Dashboard.jsx',
  /const greeting = TRANSLATIONS\[lang\]\[new Date\(\)\.getHours\(\) < 12 \? 'morning' : new Date\(\)\.getHours\(\) < 17 \? 'afternoon' : 'evening'\];/g,
  `import { getKolkataTime } from '../../utils/time.js';\n  const hr = getKolkataTime().getHours();\n  const greeting = TRANSLATIONS[lang][hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening'];`
);

console.log("Farmer pages patched safely.");
