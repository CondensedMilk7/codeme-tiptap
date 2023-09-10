import { lowlight } from 'lowlight/lib/core';

export const registerHighlightLanguages = async (
  config: Record<string, any>
) => {
  const languageMap: Record<string, Promise<any>> = {
    javascript: import('highlight.js/lib/languages/javascript'),
    html: import('highlight.js/lib/languages/xml'),
    css: import('highlight.js/lib/languages/css'),
    typescript: import('highlight.js/lib/languages/typescript'),
    python: import('highlight.js/lib/languages/python'),
  };

  const promises: Promise<void>[] = [];

  Object.keys(languageMap).forEach((lang) => {
    if (config[lang]) {
      const promise = languageMap[lang]
        .then((importedLangModule) => {
          lowlight.registerLanguage(lang, importedLangModule.default);
          console.log('registered language', lowlight.listLanguages());
        })
        .catch((error) => {
          console.error(`Error registering ${lang}`, error);
        });

      promises.push(promise);
    }
  });

  await Promise.all(promises);
};
