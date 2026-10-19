import { Platform } from 'react-native';

export const colors = {
  navy: '#101D29', deep: '#09121B', panel: '#172B39', ivory: '#F1E6CF',
  paper: '#E8D8B6', ink: '#28241F', muted: '#C1C0B8', brass: '#D5B170',
  line: '#3A4851', burgundy: '#813D4D', paperLine: '#CBB58D', walnut: '#5B3A26', walnutLight: '#7A5236',
  // Rating tiers: gold for a hint-free solve, then silver, bronze and a quiet slate.
  gold: '#F2CF7A', silver: '#CBD5DA', bronze: '#C98F63', slate: '#8FA0A8',
};
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, section: 32 };
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });
export const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });
