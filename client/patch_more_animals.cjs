const fs = require('fs');
const file = 'C:/Users/KARTIKEYA/.gemini/antigravity/scratch/pashusuraksha/client/src/pages/farmer/HerdLedger.jsx';
let code = fs.readFileSync(file, 'utf8');

const moreAnimals = `
  { id:"C-005", tagId:"MH-NK-4890", species:"Cattle", breed:"Gir", sex:"Female", age:"2 yrs", village:"Malegaon", status:"healthy", vaccinated:true, lastVaccine:"FMD - Apr 2026", vaccines:[], treatments:[], events:[] },
  { id:"B-003", tagId:"MH-NK-4891", species:"Buffalo", breed:"Murrah", sex:"Female", age:"4 yrs", village:"Satana", status:"healthy", vaccinated:true, lastVaccine:"HS - Jan 2026", vaccines:[], treatments:[], events:[] },
  { id:"G-004", tagId:"MH-NK-4892", species:"Goat", breed:"Osmanabadi", sex:"Male", age:"1 yr", village:"Malegaon", status:"healthy", vaccinated:false, lastVaccine:"None", vaccines:[], treatments:[], events:[] },
  { id:"S-002", tagId:"MH-NK-4893", species:"Sheep", breed:"Deccani", sex:"Female", age:"3 yrs", village:"Baglan", status:"healthy", vaccinated:true, lastVaccine:"PPR - Nov 2025", vaccines:[], treatments:[], events:[] },
  { id:"C-006", tagId:"MH-NK-4894", species:"Cattle", breed:"Jersey Cross", sex:"Female", age:"5 yrs", village:"Malegaon", status:"healthy", vaccinated:true, lastVaccine:"FMD - Apr 2026", vaccines:[], treatments:[], events:[] },
  { id:"B-004", tagId:"MH-NK-4895", species:"Buffalo", breed:"Jafarabadi", sex:"Male", age:"2 yrs", village:"Malegaon", status:"healthy", vaccinated:true, lastVaccine:"HS - Jan 2026", vaccines:[], treatments:[], events:[] },
  { id:"G-005", tagId:"MH-NK-4896", species:"Goat", breed:"Sirohi", sex:"Female", age:"2 yrs", village:"Satana", status:"healthy", vaccinated:true, lastVaccine:"PPR - Nov 2025", vaccines:[], treatments:[], events:[] },
  { id:"C-007", tagId:"MH-NK-4897", species:"Cattle", breed:"Khillar", sex:"Male", age:"4 yrs", village:"Baglan", status:"healthy", vaccinated:true, lastVaccine:"FMD - Apr 2026", vaccines:[], treatments:[], events:[] },
  { id:"G-006", tagId:"MH-NK-4898", species:"Goat", breed:"Osmanabadi", sex:"Female", age:"3 yrs", village:"Malegaon", status:"healthy", vaccinated:true, lastVaccine:"PPR - Nov 2025", vaccines:[], treatments:[], events:[] },
  { id:"B-005", tagId:"MH-NK-4899", species:"Buffalo", breed:"Murrah", sex:"Female", age:"6 yrs", village:"Satana", status:"healthy", vaccinated:false, lastVaccine:"None", vaccines:[], treatments:[], events:[] },
];

const SUMMARY = { total: 20, healthy: 17, observation: 2, vacDue: 4 };`

code = code.replace(
  /];\s*const SUMMARY = { total: 10, healthy: 8, observation: 2, vacDue: 2 };/,
  moreAnimals
);

fs.writeFileSync(file, code);
console.log("HerdLedger animals increased");
