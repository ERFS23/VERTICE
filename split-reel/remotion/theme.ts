import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/instrument-serif/400-italic.css';

// Paleta "neon magenta" do reel de referência. Troque aqui para a identidade da marca.
export const T = {
  bg: '#050306',
  panel: '#0D070C',
  panelBorder: 'rgba(255,45,122,0.55)',
  pink: '#FF2D7A',
  magenta: '#E0177F',
  purple: '#8A3FFC',
  white: '#F4F1F5',
  grey: '#A9A6AE',
  dim: '#6E6A73',
  tag: '#E8692F',
  green: '#22C55E',
  grad: 'linear-gradient(90deg,#FF2D7A 0%,#C026D3 50%,#8A3FFC 100%)',
  tileGrad: (i: number) => {
    // tiles do grid vão do rosa (topo) ao roxo (base), como no reel
    const row = Math.floor(i / 3);
    return ['linear-gradient(135deg,#FF2D7A,#D61F8C)', 'linear-gradient(135deg,#D61F8C,#A63BE8)', 'linear-gradient(135deg,#9B4DF5,#7C5CFF)'][row % 3];
  },
  glow: (c = '#FF2D7A', r = 24) => `0 0 ${r}px ${c}80, 0 0 ${r * 2}px ${c}33`,
  sans: 'Inter, sans-serif',
  mono: '"JetBrains Mono", monospace',
  serif: '"Instrument Serif", serif',
};

// Geometria do quadro 1080x1920: metade de cima = motion, metade de baixo = vídeo cru.
export const W = 1080;
export const H = 1920;
export const SPLIT = 960;
