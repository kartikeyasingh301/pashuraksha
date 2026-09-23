const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/ReportForm.jsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the emojis with icons
code = code.replace(
  '<button onClick={() => setActiveTab("standard")}',
  '<button onClick={() => setActiveTab("standard")}'
);
// wait, let's just do exact string replacements
code = code.replace(
  '?? Speak Your Problem</button>',
  '<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}><Mic size={16} /> Voice Assistant</div></button>'
);
code = code.replace(
  '<FileText size={16} /> Standard Report</div></button>',
  '<FileText size={16} /> Fill a Form</div></button>'
);
code = code.replace(
  '??\r\n            </div>',
  '<Mic size={40} />\r\n            </div>'
);
code = code.replace(
  '??\n            </div>',
  '<Mic size={40} />\n            </div>'
);
code = code.replace(
  '?? Start Recording</button>',
  '<Mic size={24} /> Start Recording</button>'
);

// Replace headers
code = code.replace('Herd & Demographics', 'About Your Animals');
code = code.replace('Clinical Assessment', 'What are the Symptoms?');
code = code.replace('Epidemiological Context', 'Farm History & Context');

// Replace Labels
code = code.replace('t.lblHerdSize || "Herd Size"', 't.lblHerdSize || "Total Animals (Herd Size)"');
code = code.replace('t.lblAnimalId}</label>', 't.lblAnimalId || "Animal ID/Tag (Optional)"}</label>');
code = code.replace('placeholder={t.phAnimalId}', 'placeholder="e.g. Tag 102"');

code = code.replace('t.lblSyndrome}</label>', 't.lblSyndrome || "Main Disease/Problem"}</label>');
code = code.replace('t.lblOnsetDate || "Symptom Onset Date"', 't.lblOnsetDate || "When did the animal get sick?"');
code = code.replace('t.lblMortality}</label>', 't.lblMortality || "How many animals died? (if any)"}</label>');
code = code.replace('value={form.mortalityCount} onChange={handleChange} />', 'value={form.mortalityCount} onChange={handleChange} placeholder="0" />');

code = code.replace('t.lblVaccine}</label>', 't.lblVaccine || "Has this animal been vaccinated?"}</label>');
code = code.replace('t.lblRecentMovement || "Recent animal movement off-farm?"', 't.lblRecentMovement || "Did you move this animal to a market recently?"');
code = code.replace('t.lblNewAnimals || "New animals introduced recently?"', 't.lblNewAnimals || "Did you buy any new animals recently?"');
code = code.replace('t.lblNotes}</label>', 't.lblNotes || "Any other details? (Optional)"}</label>');
code = code.replace('t.lblGps}</label>', 't.lblGps || "Farm Location"}</label>');
code = code.replace('GPS Recorded', 'Location Recorded');

fs.writeFileSync(file, code);
console.log('Fixed');
