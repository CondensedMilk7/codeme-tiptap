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
import CodeBlockLowlight, {
  CodeBlockLowlightOptions,
} from '@tiptap/extension-code-block-lowlight';
import { ComponentPortal } from '@angular/cdk/portal';
import { lowlight } from 'lowlight/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';
import { CommonModule } from '@angular/common';

lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('typescript', typescript);

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

  @Input() set cdmCodeIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<CodeBlockLowlightOptions> | null>(null);
  button = new ComponentPortal(CdmCodeButton);

  extension = () =>
    import('@tiptap/extension-code-block-lowlight').then(
      (m) => m.CodeBlockLowlight
    );
}
@Component({
  imports: [CommonModule],
  selector: 'cdm-code-button',
  template: `<button (click)="onClick()">
    <img
      *ngIf="iconPath$ | async; else textCode"
      [src]="iconPath$ | async"
      alt="Code"
    />
    <ng-template #textCode>Code</ng-template>
  </button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmCodeButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private CdmCodeDirective: CdmCodeDirective) {
    this.iconPath$ = this.CdmCodeDirective.iconPath;
    this.iconPath$.subscribe((data) => {
      console.log('Icon Path:', data);
    });
  }
  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleCodeBlock().run()
    );
  }
}
