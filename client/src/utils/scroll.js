/**
 * Controlled Smooth Scroll Utility
 * Provides a comfortable, fluid scroll transition for section navigation.
 * 
 * Key behaviours:
 * 1. Controlled duration: dynamically scaled (500ms - 750ms) with cubic ease-in-out.
 * 2. Interaction-safe: cancels immediately on mouse wheel or touch gesture so it never fights the user.
 * 3. Reduced-motion compliant: jumps instantly if the user prefers reduced motion.
 * 4. Multi-trigger safe: cancels any ongoing scroll before starting a new one.
 */

let activeRafId = null;
let activeInteractionHandler = null;

const removeInteractionListeners = () => {
  if (activeInteractionHandler) {
    window.removeEventListener('wheel', activeInteractionHandler);
    window.removeEventListener('touchstart', activeInteractionHandler);
    window.removeEventListener('keydown', activeInteractionHandler);
    activeInteractionHandler = null;
  }
};

export const cancelSmoothScroll = () => {
  if (activeRafId !== null) {
    cancelAnimationFrame(activeRafId);
    activeRafId = null;
  }
  removeInteractionListeners();
};

const setScrollPosition = (top) => {
  try {
    window.scrollTo({ top, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, top);
  }
};

/**
 * Smoothly scrolls to a target Y position with comfortable cubic ease-in-out easing.
 * @param {number} targetPosition - Target scroll offset in pixels
 * @param {number} [customDuration] - Optional custom duration in milliseconds
 */
export const smoothScrollTo = (targetPosition, customDuration) => {
  // Cancel any existing animation or listeners
  cancelSmoothScroll();

  // 1. Accessibility: Instant jump if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (prefersReducedMotion) {
    setScrollPosition(targetPosition);
    return;
  }

  const startPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
  const distance = targetPosition - startPosition;

  // If already at or very close to target, finish immediately
  if (Math.abs(distance) < 3) {
    setScrollPosition(targetPosition);
    return;
  }

  // 2. Scaled comfortable duration:
  // Short distance (~400px): ~500ms
  // Medium distance (~1500px): ~600ms
  // Long distance (~4000px): ~750ms
  const duration = customDuration || Math.min(750, Math.max(500, Math.abs(distance) * 0.08 + 480));

  // 3. Graceful user interaction cancel
  activeInteractionHandler = () => {
    cancelSmoothScroll();
  };
  window.addEventListener('wheel', activeInteractionHandler, { passive: true, once: true });
  window.addEventListener('touchstart', activeInteractionHandler, { passive: true, once: true });
  window.addEventListener('keydown', activeInteractionHandler, { passive: true, once: true });

  // 4. Cubic ease-in-out curve for gentle acceleration and soft deceleration
  const easeInOutCubic = (t) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  let startTime = null;

  const step = (currentTime) => {
    if (startTime === null) {
      startTime = currentTime;
    }
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    setScrollPosition(startPosition + distance * ease);

    if (progress < 1) {
      activeRafId = requestAnimationFrame(step);
    } else {
      activeRafId = null;
      removeInteractionListeners();
    }
  };

  activeRafId = requestAnimationFrame(step);
};

