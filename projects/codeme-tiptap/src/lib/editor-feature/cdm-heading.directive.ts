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
  @Input() set cdmHeading(options: Partial<HeadingOptions>) {
    if (options) this.config.next(options);
    this.enabled.next(true);
    console.log('enabled and configured heading extension');
  }

  enabled = new BehaviorSubject(true);
  config = new BehaviorSubject({});

  extension = () => import('@tiptap/extension-heading');
}
