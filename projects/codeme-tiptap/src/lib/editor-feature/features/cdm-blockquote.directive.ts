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
import { Blockquote, BlockquoteOptions } from '@tiptap/extension-blockquote';
import { CommonModule } from '@angular/common';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmBlockquote], tiptap-editor[cdmBlockquote]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmBlockquoteDirective,
      multi: true,
    },
  ],
})
export class CdmBlockquoteDirective
  implements EditorFeature<BlockquoteOptions>
{
  @Input() set cdmBlockquote(config: Partial<BlockquoteOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  @Input() set cdmBlockquoteIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<BlockquoteOptions> | null>(null);
  button = new ComponentPortal(CdmBlockquoteButton);

  extension = () =>
    import('@tiptap/extension-blockquote').then((m) => m.Blockquote as any);
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-blockquote-button',
  template: `
    <button (click)="onClick()">
      <img
        *ngIf="iconPath$ | async; else textBlockquote"
        [src]="iconPath$ | async"
        alt="Blockquote"
      />
      <ng-template #textBlockquote>Blockquote</ng-template>
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmBlockquoteButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private CdmBlockquoteDirective: CdmBlockquoteDirective) {
    this.iconPath$ = this.CdmBlockquoteDirective.iconPath;
  }

  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleBlockquote().run()
    );
  }
}
