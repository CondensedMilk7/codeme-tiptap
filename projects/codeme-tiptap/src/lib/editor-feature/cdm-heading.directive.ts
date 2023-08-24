import { Directive, Input } from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from './editor-feature';
import { BehaviorSubject } from 'rxjs';
import { HeadingOptions } from '@tiptap/extension-heading';

@Directive({
  standalone: true,
  selector:
    'cdm-tiptap-editor[cdmHeading], tiptap-editor[cdmHeading], div#editor[cdmHeading]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmHeadingDirective,
      multi: true,
    },
  ],
})
export class CdmHeadingDirective implements EditorFeature {
  @Input() set cdmHeading(config: Partial<HeadingOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HeadingOptions> | null>(null);

  extension = () => import('@tiptap/extension-heading').then((m) => m.Heading);
}
