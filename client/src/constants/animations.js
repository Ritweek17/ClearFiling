// Framer Motion Animation Presets & Variants

export const TRANSITIONS = {
  default: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }, // Custom premium cubic-bezier easeOut
  quick: { duration: 0.2, ease: 'easeInOut' },
  slow: { duration: 0.6, ease: 'easeOut' },
};

export const VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: TRANSITIONS.default,
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: TRANSITIONS.default,
  },
  fadeInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: TRANSITIONS.default,
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: TRANSITIONS.default,
  },
  hoverScale: {
    whileHover: { scale: 1.02 },
    transition: TRANSITIONS.quick,
  },
};

export default { TRANSITIONS, VARIANTS };
