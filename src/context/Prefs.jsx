import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { strings } from '../i18n/strings';

const PrefsContext = createContext(null);

const read = (key, allowed, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — the choice just won't persist
  }
};

const browserLang = () =>
  typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('ru') ? 'ru' : 'en';

export function PrefsProvider({ children }) {
  const [theme, setTheme] = useState(() => read('theme', ['dark', 'light'], 'dark'));
  const [lang, setLang] = useState(() => read('lang', ['en', 'ru'], browserLang()));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    save('lang', lang);
  }, [lang]);

  const value = useMemo(
    () => ({ theme, setTheme, lang, setLang, t: strings[lang] }),
    [theme, lang]
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);
