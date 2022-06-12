import commonEN from './common/en.json';
import landingPageEN from './landing-page/en.json';

import commonRU from './common/ru.json';
import landingPageRU from './landing-page/ru.json';

export const loadLocales = () => ({
  en: {
    ...commonEN,
    ...landingPageEN,
  },
  ru: {
    ...commonRU,
    ...landingPageRU,
  },
});
