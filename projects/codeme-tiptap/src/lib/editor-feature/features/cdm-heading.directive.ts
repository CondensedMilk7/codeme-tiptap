import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  inject,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject, take } from 'rxjs';
import { HeadingOptions, Level } from '@tiptap/extension-heading';
import { EditorService } from '../../editor.service';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmHeading], tiptap-editor[cdmHeading]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmHeadingDirective,
      multi: true,
    },
  ],
})
export class CdmHeadingDirective implements EditorFeature<HeadingOptions> {
  @Input() set cdmHeading(config: Partial<HeadingOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HeadingOptions> | null>(null);
  button = new ComponentPortal(CdmHeadingButton);

  extension = () => import('@tiptap/extension-heading').then((m) => m.Heading);
}

@Component({
  selector: 'cdm-heading-button',
  template: `
    <button (click)="onClick(1)">H1</button>
    <button (click)="onClick(2)">H2</button>
    <button (click)="onClick(3)">H3</button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmHeadingButton {
  editor$ = inject(EditorService).editor$;

  onClick(level: Level) {
    this.editor$.pipe(take(1)).subscribe((editor) => {
      editor.chain().focus().toggleHeading({ level }).run();
    });
  }
}
