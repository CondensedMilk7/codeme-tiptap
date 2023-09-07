import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  inject,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject } from 'rxjs';
import { lowlight } from 'lowlight/lib/core';
import { EditorService } from '../../editor.service';
import CodeBlockLowlight, {
  CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmCode], tiptap-editor[cdmCode]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmCodeDirective,
      multi: true,
    },
  ],
})
export class CdmCodeDirective
  implements EditorFeature<CodeBlockLowlightOptions>
{
  @Input() set cdmCode(config: Partial<CodeBlockLowlightOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<CodeBlockLowlightOptions> | null>(null);
  button = new ComponentPortal(CdmCodeButton);

  extension = () =>
    import('@tiptap/extension-code-block-lowlight').then(
      (m) => m.CodeBlockLowlight
    );
}
@Component({
  selector: 'cdm-code-button',
  template: ` <button (click)="onClick()">Code</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmCodeButton {
  editorService = inject(EditorService);

  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleCodeBlock().run()
    );
  }
}
