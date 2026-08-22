import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — automatically scrolls the window to the top on every route change.
 * Drop this inside BrowserRouter so it has access to location context.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 10);
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
