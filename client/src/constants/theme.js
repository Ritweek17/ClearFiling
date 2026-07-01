import COLORS from './colors';
import TYPOGRAPHY from './typography';
import SPACING from './spacing';
import { VARIANTS, TRANSITIONS } from './animations';

export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  animations: {
    variants: VARIANTS,
    transitions: TRANSITIONS,
  },
  borderRadius: {
    button: 'rounded-lg',
    badge: 'rounded-full',
    card: 'rounded-xl',
    banner: 'rounded-3xl',
  },
  shadows: {
    border: 'border border-slate-200/60',
    card: 'shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200/60',
    hover: 'shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-brand-primary/20',
    overlay: 'shadow-[0_4px_20px_rgba(15,23,42,0.03)] backdrop-blur-md bg-white/80',
  },
};

export default THEME;
