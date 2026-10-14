import {Word} from '../types';

export type Layout = 'full' | 'stage' | 'canvas' | 'light' | 'screen';

// Cada cena escolhe um layout. `items` são desenhados por cima, em coordenadas 1920x1080.
export type TItem = {type: string; at: number; out?: number; x?: number; y?: number; [k: string]: any};
export type Scene = {start: number; end: number; layout: Layout; head?: {text: string; accent?: string; at?: number}; items: TItem[]; side?: 'left' | 'right'};
export type TalkProps = {
  video: string;
  videoStart?: number;
  objectPosition?: string;
  brand?: string; // wordmark no canto superior esquerdo
  handle?: string; // @ no layout screen
  screen?: string; // gravação de tela (public/...) para o layout "screen"
  durationSec?: number;
  words: Word[];
  scenes: Scene[];
};
