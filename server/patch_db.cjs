const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'db/database.js');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/Rajkot/g, 'Nashik');
code = code.replace(/Gondal/g, 'Malegaon');
code = code.replace(/Jetpur/g, 'Satana');
code = code.replace(/Surat/g, 'Ahilyanagar');
code = code.replace(/Olpad/g, 'Sangamner');
code = code.replace(/Vadodara/g, 'Pune');
code = code.replace(/Karjan/g, 'Baramati');
code = code.replace(/GJ-RJ-/g, 'MH-NK-');
code = code.replace(/GJ-SU-/g, 'MH-AN-');
code = code.replace(/GJ-VD-/g, 'MH-PN-');

// Coords adjustment
// Gondal -> Malegaon: la: 20.55, ln: 74.52
code = code.replace(/22\.0397/g, '20.5522');
code = code.replace(/70\.7080/g, '74.5244');
code = code.replace(/22\.3247/g, '20.5540');
code = code.replace(/70\.7897/g, '74.5260');
code = code.replace(/22\.3261/g, '20.5561');
code = code.replace(/70\.7912/g, '74.5282');
code = code.replace(/22\.3255/g, '20.5555');
code = code.replace(/70\.7880/g, '74.5210');
// Jetpur -> Satana: la: 20.59, ln: 74.20
code = code.replace(/21\.7531/g, '20.5931');
code = code.replace(/70\.6237/g, '74.2037');
code = code.replace(/21\.7548/g, '20.5948');
code = code.replace(/70\.6252/g, '74.2052');
// Olpad -> Sangamner: la: 19.57, ln: 74.20
code = code.replace(/21\.3283/g, '19.5783');
code = code.replace(/72\.7441/g, '74.2041');
code = code.replace(/21\.3300/g, '19.5700');
code = code.replace(/72\.7450/g, '74.2050');
// Karjan -> Baramati: la: 18.15, ln: 74.58
code = code.replace(/22\.0465/g, '18.1565');
code = code.replace(/73\.1251/g, '74.5851');

fs.writeFileSync(file, code, 'utf8');
console.log("Database seeded data patched for Maharashtra!");
