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

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<HistoryOptions> | null>(null);
  button = new ComponentPortal(CdmGoForwardButton);

  extension = () =>
    import('@tiptap/extension-history').then((m) => m.History as any);
}

@Component({
  selector: 'cdm-go-forward-button',
  template: ` <button (click)="onClick()">Go Forward</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmGoForwardButton {
  editorService = inject(EditorService);

  onClick() {
    this.editorService.exec((editor) => editor.chain().focus().redo().run());
  }
}
