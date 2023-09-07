import { Injectable } from '@angular/core';
import { lowlight } from 'lowlight/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';

@Injectable({
  providedIn: 'root',
})
export class LowlightService {
  constructor() {
    this.registerLanguages();
    alert('LowlightService');
  }

  private registerLanguages() {
    lowlight.registerLanguage('javascript', javascript);
    lowlight.registerLanguage('html', html);
    lowlight.registerLanguage('css', css);
    lowlight.registerLanguage('typescript', typescript);
  }
}
