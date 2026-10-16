// Presentation-only metadata, kept apart from authored case content so existing case definitions
// (and their pinned digests) do not change.
export type Emblem = 'envelope' | 'piano' | 'mask' | 'music-box' | 'key' | 'telephone' | 'frame';
type Presentation = { emblem: Emblem; paperDate: string };

const presentation: Record<string, Presentation> = {
  'the-missing-envelope': { emblem: 'envelope', paperDate: 'OCTOBER 1994' },
  'the-last-reservation': { emblem: 'envelope', paperDate: 'OCTOBER 1994' },
  'the-silent-piano': { emblem: 'piano', paperDate: 'OCTOBER 1994' },
  'the-masquerade-coat': { emblem: 'mask', paperDate: 'OCTOBER 1994' },
  'the-music-box': { emblem: 'music-box', paperDate: 'NOVEMBER 1994' },
  'the-room-never-booked': { emblem: 'key', paperDate: 'NOVEMBER 1994' },
  'the-last-call': { emblem: 'telephone', paperDate: 'NOVEMBER 1994' },
  'the-portrait-behind-the-wall': { emblem: 'frame', paperDate: 'NOVEMBER 1994' },
};
export const presentationFor = (caseId: string): Presentation =>
  presentation[caseId] ?? { emblem: 'envelope', paperDate: 'OCTOBER 1994' };
