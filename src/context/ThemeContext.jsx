import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('hubert-theme');
    const isDark = saved === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'hubert-dark' : 'hubert');
    return isDark;
  });

  const [collapsed, setCollapsed] = useState(() => {
    const c = localStorage.getItem('hubert-sidebar') === 'collapsed';
    document.documentElement.style.setProperty('--sidebar-w', c ? '64px' : '256px');
    return c;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'hubert-dark' : 'hubert');
    localStorage.setItem('hubert-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('hubert-sidebar', collapsed ? 'collapsed' : 'expanded');
    document.documentElement.style.setProperty('--sidebar-w', collapsed ? '64px' : '256px');
  }, [collapsed]);

  return (
    <ThemeContext.Provider value={{
      dark,
      toggle: () => setDark(d => !d),
      collapsed,
      toggleSidebar: () => setCollapsed(v => !v),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
