import {interpolate, spring, Easing} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrada "pop" com mola: escala 0.6→1, sobe 30px, fade-in. Saída: fade + leve zoom.
export const popIn = (frame: number, fps: number, atSec: number, damping = 13) =>
  spring({frame: frame - atSec * fps, fps, config: {damping, mass: 0.7, stiffness: 140}});

export const fadeOut = (frame: number, fps: number, outSec: number, dur = 0.22) =>
  interpolate(frame, [(outSec - dur) * fps, outSec * fps], [1, 0], clamp);

export const ease = (frame: number, fps: number, from: number, to: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [from * fps, to * fps], [a, b], {...clamp, easing: e});

// pseudo-aleatório determinístico (Remotion exige render reproduzível)
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
