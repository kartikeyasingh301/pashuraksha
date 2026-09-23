const http = require('http');

async function test() {
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'farmer1', password: 'farmer123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  const chatRes = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message: 'Hello', lang: 'en' })
  });
  const chatData = await chatRes.json();
  console.log(chatData);
}

test();
