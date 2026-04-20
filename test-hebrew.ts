import type { Language } from './config';

const testHebrew = {
  he: {
    common: {
      loading: 'טוען...',
    },
  },
};

export type TranslationSet = typeof testHebrew.he;