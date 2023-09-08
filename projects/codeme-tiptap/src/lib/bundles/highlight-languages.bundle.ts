import { lowlight } from 'lowlight/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';

export const registerHighlightLanguages = (config: Record<string, any>) => {
  if (config['javascript']) {
    lowlight.registerLanguage('javascript', javascript);
  }
  if (config['html']) {
    lowlight.registerLanguage('html', html);
  }
  if (config['css']) {
    lowlight.registerLanguage('css', css);
  }
  if (config['typescript']) {
    lowlight.registerLanguage('typescript', typescript);
  }
};
