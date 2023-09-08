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
import { History, HistoryOptions } from '@tiptap/extension-history';
import { CommonModule } from '@angular/common';
@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmRedo], tiptap-editor[cdmRedo]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmGoForwardDirective,
      multi: true,
    },
  ],
})
export class CdmGoForwardDirective implements EditorFeature<HistoryOptions> {
  @Input() set cdmRedo(config: Partial<HistoryOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }
  @Input() set cdmRedoIconPath(path: string) {
    this.iconPath.next(path);
  }

  iconPath = new BehaviorSubject<string | null>(null);
  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HistoryOptions> | null>(null);
  button = new ComponentPortal(CdmGoForwardButton);

  extension = () =>
    import('@tiptap/extension-history').then((m) => m.History as any);
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-go-forward-button',
  template: `
    <button (click)="onClick()">
      <img
        *ngIf="iconPath$ | async; else goBackText"
        [src]="iconPath$ | async"
        alt="Undo"
      />
    </button>
    <ng-template #goBackText>Redo</ng-template>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmGoForwardButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private CdmGoForwardDirective: CdmGoForwardDirective) {
    this.iconPath$ = this.CdmGoForwardDirective.iconPath;
  }
  onClick() {
    this.editorService.exec((editor) => editor.chain().focus().redo().run());
  }
}
