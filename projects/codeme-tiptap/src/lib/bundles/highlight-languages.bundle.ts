import { lowlight } from 'lowlight/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
export const registerHighlightLanguages = (config: Record<string, any>) => {
  const languageMap = {
    javascript: javascript,
    html: html,
    css: css,
    typescript: typescript,
    python: python,
  } as Record<string, any>;

  Object.keys(languageMap).forEach((lang) => {
    if (config[lang]) {
      lowlight.registerLanguage(lang, languageMap[lang]);
    }
  });
};
