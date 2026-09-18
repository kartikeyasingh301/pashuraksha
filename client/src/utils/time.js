export function getKolkataTime() {
  const d = new Date();
  return new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}

export function formatKolkataTime(dateString, lang = 'en-IN') {
  const d = dateString ? new Date(dateString) : new Date();
  return new Intl.DateTimeFormat(lang, {
    timeZone: 'Asia/Kolkata',
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(d);
}

export function getGreeting() {
  const hr = getKolkataTime().getHours();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}
