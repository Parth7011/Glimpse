import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — automatically scrolls the window to the top on every route change.
 * Drop this inside BrowserRouter so it has access to location context.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll to top on route change to prevent conflicts with Lenis and guarantee it works
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
