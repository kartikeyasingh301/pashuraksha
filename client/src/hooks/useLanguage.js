import { useState, useEffect } from 'react';

export function useLanguage() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('pashu_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('pashu_lang', lang);
  }, [lang]);

  return [lang, setLang];
}
