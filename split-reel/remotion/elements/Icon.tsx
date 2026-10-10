import React from 'react';

// Ícones de traço (viewBox 24). Use pelo nome em qualquer elemento que aceite `icon`.
const P: Record<string, React.ReactNode> = {
  menu: <path d="M5 7h14M5 12h14M5 17h9" />,
  carousel: <path d="M8 5h8v14H8zM4 7v10M20 7v10" />,
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  flame: <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 1 1 2 2 3 3 0-2 0-4 0-6z" />,
  smile: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 14.5c1.8 2 5.2 2 7 0M9 9.5h.01M15 9.5h.01" />,
  hash: <path d="M9 4 7 20M17 4l-2 16M4 9h16M3 15h16" />,
  users: <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4.5a3.5 3.5 0 0 1 0 6.5M21 20c0-3-1.6-5.2-4-5.8" />,
  recycle: <path d="M7 19H4l2.5-4.5M17 19h3l-2.5-4.5M12 4l1.5 2.6M8 9l-2 3.5M16 9l2 3.5M9 19h6M10.5 4h3" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />,
  play: <path d="M8 5v14l11-7z" />,
  check: <path d="M5 12.5 10 17l9-10" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  send: <path d="M21 3 3 10l7 3 3 7zM10 13l11-10" />,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  camera: <path d="M4 7h4l2-3h4l2 3h4v12H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5" />,
  home: <path d="M3 11 12 4l9 7M5 10v10h14V10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  money: <path d="M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  rocket: <path d="M12 15c4-3 6-7 6-12-5 0-9 2-12 6l-3 1 3 3 3 3 1-3zM6 18l-2 2M15 9h.01" />,
  lock: <path d="M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3" />,
  terminal: <path d="M4 5h16v14H4zM7 10l3 2-3 2M12 15h4" />,
};

export const Icon: React.FC<{name: string; size?: number; color?: string; stroke?: number}> = ({name, size = 40, color = '#fff', stroke = 2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {P[name] ?? P.star}
  </svg>
);

export const ICON_NAMES = Object.keys(P);
