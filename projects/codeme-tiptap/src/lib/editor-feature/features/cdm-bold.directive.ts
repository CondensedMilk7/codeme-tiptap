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
import { CommonModule } from '@angular/common';

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

  //? Icon Path
  @Input() set cdmBoldIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<BoldOptions> | null>(null);
  button = new ComponentPortal(CdmBoldButton);

  extension = () => import('@tiptap/extension-bold').then((m) => m.Bold as any);
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-bold-button',
  template: `
    <button (click)="onClick()">
      <img
        *ngIf="iconPath$ | async; else textBold"
        [src]="iconPath$ | async"
        alt="Bold"
      />
      <ng-template #textBold>Bold</ng-template>
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmBoldButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private cdmBoldDirective: CdmBoldDirective) {
    this.iconPath$ = this.cdmBoldDirective.iconPath;
  }

  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleBold().run()
    );
  }
}
