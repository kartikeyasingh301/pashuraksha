
export function getKolkataHour() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hourCycle: 'h23'
  });
  return parseInt(formatter.format(new Date()), 10);
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
  const hr = getKolkataHour();
  if (hr < 12) return 'Good morning';
  if (hr < 17) return 'Good afternoon';
  return 'Good evening';
}
