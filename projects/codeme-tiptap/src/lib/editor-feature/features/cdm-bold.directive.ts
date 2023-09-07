import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  inject,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject } from 'rxjs';
import { EditorService } from '../../editor.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { Bold, BoldOptions } from '@tiptap/extension-bold';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmBold], tiptap-editor[cdmBold]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmBoldDirective,
      multi: true,
    },
  ],
})
export class CdmBoldDirective implements EditorFeature<BoldOptions> {
  @Input() set cdmBold(config: Partial<BoldOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<BoldOptions> | null>(null);
  button = new ComponentPortal(CdmBoldButton);

  extension = () => import('@tiptap/extension-bold').then((m) => m.Bold as any);
}

@Component({
  selector: 'cdm-bold-button',
  template: ` <button (click)="onClick()">Bold</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmBoldButton {
  editorService = inject(EditorService);

  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleBold().run()
    );
  }
}
