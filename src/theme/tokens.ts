export const colors = {
  primary: '#2B9BEC',
  primaryDark: '#0F619F',
  primaryDarker: '#05497B',
  primaryLight: '#4AACF2',
  skyAccent: '#90C4E8',
  skySoft: '#E8F2FB',
  surface: '#FFFFFF',
  surfaceSoft: '#FDF4F0',
  blush: '#FDE5E4',
  blushDeep: '#F5B8B6',
  textDark: '#0B1927',
  textMuted: '#346D98',
  textSoft: '#7A99B5',
  success: '#34C77B',
  warning: '#F5A623',
  danger: '#E85D5D',
  white: '#FFFFFF',
  // alias untuk kolaborasi GitHub (INK/MUTED/PALE) — sinkron dengan App.tsx ChatGPT
  ink: '#183049',
  muted: '#6E8292',
  pale: '#EAF8FE',
  githubBlue: '#0796D5',
  githubDark: '#07567D',
} as const;

export const gradients = {
  brand: ['#4AACF2', '#2B9BEC', '#0F619F', '#05497B'] as const,
  header: ['#4AACF2', '#2B9BEC'] as const,
  button: ['#4AACF2', '#2B9BEC'] as const,
  card: ['#FFFFFF', '#F4FAFF'] as const,
  // gradient GitHub (kolaborasi ChatGPT) — lebih dalam, dipakai di Splash/Onboarding/Record
  github: ['#10A9EB', '#087CB4', '#064B70'] as const,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

export const shadow = {
  card: {
    shadowColor: '#0F619F',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  fab: {
    shadowColor: '#05497B',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
} as const;

export const font = {
  title: 28,
  heading: 22,
  body: 15,
  small: 13,
  tiny: 11,
} as const;
