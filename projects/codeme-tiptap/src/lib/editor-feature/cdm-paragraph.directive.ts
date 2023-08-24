import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from './editor-feature';
import { BehaviorSubject, from } from 'rxjs';
import { ParagraphOptions } from '@tiptap/extension-paragraph';

@Directive({
  standalone: true,
  selector:
    'cdm-tiptap-editor[cdmParagraph], tiptap-editor[cdmParagraph], div#editor[cdmParagraph]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmParagraphDirective,
      multi: true,
    },
  ],
})
export class CdmParagraphDirective implements EditorFeature, OnChanges {
  // Can use setter with param type <SomeOptions | ''>
  @Input() cdmParagraph!: Partial<ParagraphOptions> | '';

  ngOnChanges(changes: SimpleChanges): void {
    const { cdmParagraph } = changes;
    if (cdmParagraph.currentValue) {
      this.config.next(cdmParagraph.currentValue);
    }
  }

  enabled = new BehaviorSubject(true);
  config = new BehaviorSubject<Partial<ParagraphOptions> | null>(null);

  extension = () =>
    from(import('@tiptap/extension-paragraph').then((m) => m.Paragraph));
}
