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
import { BulletList, BulletListOptions } from '@tiptap/extension-bullet-list';
import { CommonModule } from '@angular/common';

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmBulletList], tiptap-editor[cdmBulletList]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmBulletListDirective,
      multi: true,
    },
  ],
})
export class CdmBulletListDirective
  implements EditorFeature<BulletListOptions>
{
  @Input() set cdmBulletList(config: Partial<BulletListOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }
  //? Icon Path
  @Input() set cdmBulletListIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<BulletListOptions> | null>(null);
  button = new ComponentPortal(CdmBulletListButton);

  extension = async () =>
    Promise.all([
      import('@tiptap/extension-bullet-list'),
      import('@tiptap/extension-list-item'),
    ]).then(([bulletListModule, listItemModule]) => {
      return [
        bulletListModule.BulletList as any,
        listItemModule.ListItem as any,
      ];
    });
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-bullet-list-button',
  template: ` <button (click)="onClick()">
    <img
      *ngIf="iconPath$ | async; else textBullet"
      [src]="iconPath$ | async"
      alt="Bullet List"
    />
    <ng-template #textBullet>Bullet List</ng-template>
  </button>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmBulletListButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;

  constructor(private CdmBulletListDirective: CdmBulletListDirective) {
    this.iconPath$ = this.CdmBulletListDirective.iconPath;
  }

  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleBulletList().run()
    );
  }
}
