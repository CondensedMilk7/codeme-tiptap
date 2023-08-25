import { Directive, Input } from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject } from 'rxjs';
import { ParagraphOptions } from '@tiptap/extension-paragraph';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmParagraph], tiptap-editor[cdmParagraph]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmParagraphDirective,
      multi: true,
    },
  ],
})
export class CdmParagraphDirective implements EditorFeature<ParagraphOptions> {
  @Input() set cdmParagraph(config: Partial<ParagraphOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<ParagraphOptions> | null>(null);

  extension = () =>
    import('@tiptap/extension-paragraph').then((m) => m.Paragraph);
}
