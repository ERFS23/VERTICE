import '@fontsource/anton/400.css';
import '../theme';

// Estilo 2 ("Talking head + motion", 16:9): verde-limão neon sobre quase-preto, ou off-white.
export const G = {
  bg: '#030403',
  light: '#FAFAF7',
  green: '#7CFF1E',
  greenDeep: '#52A90B',
  ink: '#0D0D0D',
  white: '#F2F4EF',
  dim: '#7A8274',
  glow: (r = 18) => `0 0 ${r}px rgba(124,255,30,.55), 0 0 ${r * 2}px rgba(124,255,30,.22)`,
  cond: 'Anton, Impact, sans-serif', // títulos condensados em caixa-alta
  sans: 'Inter, sans-serif',
  mono: '"JetBrains Mono", monospace',
};
export const TW = 1920;
export const TH = 1080;
