const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/Chatbot.jsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/Pashuraksha AI Assistant/g, "Pashuraksha Health Assistant");
code = code.replace(/Pashuraksha AI ?/g, "Pashuraksha Health Assistant");
code = code.replace(/>AI Help</g, ">Health Assistance<");
code = code.replace(/Pashu AI/g, "Health Assistance");

fs.writeFileSync(file, code, 'utf8');
console.log("Chatbot AI references neutralized.");
