import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class CdmHeadingDirective implements EditorFeature, OnChanges {
  @Input() cdmHeading!: Partial<HeadingOptions> | '';

  ngOnChanges({ cdmHeading }: SimpleChanges): void {
    if (cdmHeading.currentValue) {
      this.config.next(cdmHeading.currentValue);
    }
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject({});

  extension = () => import('@tiptap/extension-heading').then((m) => m.Heading);
}
