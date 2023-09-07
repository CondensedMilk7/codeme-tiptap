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

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HistoryOptions> | null>(null);
  button = new ComponentPortal(CdmGoBackButton);

  constructor(private historyService: TiptapHistoryService) {}

  extension = () =>
    import('@tiptap/extension-history').then((m) => m.History as any);
}

@Component({
  selector: 'cdm-go-back-button',
  template: ` <button (click)="onClick()">Go Back</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmGoBackButton {
  editorService = inject(EditorService);

  onClick() {
    this.editorService.exec((editor) => editor.chain().focus().undo().run());
  }
}
