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
import { Italic, ItalicOptions } from '@tiptap/extension-italic';
import { CommonModule } from '@angular/common';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmItalic], tiptap-editor[cdmItalic]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmItalicDirective,
      multi: true,
    },
  ],
})
export class CdmItalicDirective implements EditorFeature<ItalicOptions> {
  @Input() set cdmItalic(config: Partial<ItalicOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  @Input() set cdmItalicIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);
  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<ItalicOptions> | null>(null);
  button = new ComponentPortal(CdmItalicButton);

  extension = () =>
    import('@tiptap/extension-Italic').then((m) => m.Italic as any);
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-italic-button',
  template: ` <button (click)="onClick()">
    <img
      *ngIf="iconPath$ | async; else textItalic"
      [src]="iconPath$ | async"
      alt="Italic"
    />
    <ng-template #textItalic>Code</ng-template>
  </button>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmItalicButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;
  constructor(private CdmItalicDirective: CdmItalicDirective) {
    this.iconPath$ = this.CdmItalicDirective.iconPath;
  }
  
  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleItalic().run()
    );
  }
}
