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
  selector: 'cdm-bullet-list-button',
  template: ` <button (click)="onClick()">Bullet List</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmBulletListButton {
  editorService = inject(EditorService);

  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleBulletList().run()
    );
  }
}
