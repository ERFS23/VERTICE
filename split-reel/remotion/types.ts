// brk = força quebra de bloco de legenda depois desta palavra
export type Word = {w: string; s: number; e: number; brk?: boolean};

// Todo elemento tem `type`, `at` (segundo em que entra) e opcionalmente `out` (segundo em que sai;
// padrão = fim do capítulo). x/y são o CENTRO do elemento dentro da metade de cima (1080x960).
export type ElementBase = {type: string; at: number; out?: number; x?: number; y?: number; scale?: number};
export type El = ElementBase & Record<string, any>;

export type Chapter = {
  label: string; // aparece no cabeçalho: "• O GANCHO"
  start: number;
  end: number;
  title?: {text: string; accent?: string}; // accent = palavra em itálico serifado com gradiente
  titleAt?: number;
  elements: El[];
};

export type ReelProps = {
  video: string; // caminho relativo a public/
  videoStart?: number;
  objectPosition?: string; // enquadramento do vídeo cru na metade de baixo
  durationSec?: number;
  brandTag?: string; // etiqueta do cursor ("Claude" no reel; use sua marca)
  words: Word[];
  chapters: Chapter[];
  captions?: {maxWords?: number; maxChars?: number};
};
