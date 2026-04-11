export const colors = {
  bg: '#0a0f1e',
  surface: '#111827',
  surface2: '#1a2235',
  border: '#1f2d47',
  accent: '#3b82f6',
  accent2: '#60a5fa',
  accentGlow: 'rgba(59,130,246,0.18)',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#f59e0b',
  text: '#f1f5f9',
  muted: '#64748b',
  muted2: '#94a3b8',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  full: 999,
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '700', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 18, fontWeight: '700', color: colors.text },
  h3: { fontSize: 15, fontWeight: '600', color: colors.text },
  body: { fontSize: 14, color: colors.text },
  small: { fontSize: 12, color: colors.muted2 },
  mono: { fontSize: 11, color: colors.muted, fontVariant: ['tabular-nums'] },
};
