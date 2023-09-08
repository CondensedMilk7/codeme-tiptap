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
  selector: 'cdm-tiptap-editor[cdmUndo], tiptap-editor[cdmUndo]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmGoBackDirective,
      multi: true,
    },
  ],
})
export class CdmGoBackDirective implements EditorFeature<HistoryOptions> {
  @Input() set cdmUndo(config: Partial<HistoryOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  @Input() set cdmUndoIconPath(path: string) {
    this.iconPath.next(path);
  }

  iconPath = new BehaviorSubject<string | null>(null);
  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HistoryOptions> | null>(null);
  button = new ComponentPortal(CdmGoBackButton);

  extension = () =>
    import('@tiptap/extension-history').then((m) => m.History as any);
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-go-back-button',
  template: `
    <button (click)="onClick()">
      <img
        *ngIf="iconPath$ | async; else goBackText"
        [src]="iconPath$ | async"
        alt="Undo"
      />
    </button>
    <ng-template #goBackText>Undo</ng-template>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmGoBackButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private CdmGoBackDirective: CdmGoBackDirective) {
    this.iconPath$ = this.CdmGoBackDirective.iconPath;
  }
  onClick() {
    this.editorService.exec((editor) => editor.chain().focus().undo().run());
  }
}
