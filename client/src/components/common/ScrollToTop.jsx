import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { cancelSmoothScroll } from '../../utils/scroll';

/**
 * ScrollToTop Component
 * Ensures navigation to a new route starts at the top (top: 0) predictably and instantly,
 * while:
 * 1. Preserving native browser scroll restoration on back/forward (POP) navigation.
 * 2. Starting destination routes cleanly at top: 0 before any subsequent hash scrolling.
 * 3. Cancelling any active smooth-scroll animations from previous routes.
 * 4. Yielding completely during in-page navigation (when pathname does not change).
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // 1. If navigating via browser back/forward (POP), allow browser native scroll restoration
    if (navigationType === 'POP') {
      return;
    }

    // Cancel any ongoing smooth scroll from previous page
    cancelSmoothScroll();

    // 2. For new route navigation (PUSH/REPLACE), reset scroll position to top instantly
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
