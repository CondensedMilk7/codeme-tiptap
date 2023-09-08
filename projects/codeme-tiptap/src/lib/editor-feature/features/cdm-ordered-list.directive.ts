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
import {
  OrderedList,
  OrderedListOptions,
} from '@tiptap/extension-ordered-list';
import { CommonModule } from '@angular/common';
@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmOrderedList], tiptap-editor[cdmOrderedList]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmOrderedListDirective,
      multi: true,
    },
  ],
})
export class CdmOrderedListDirective
  implements EditorFeature<OrderedListOptions>
{
  @Input() set cdmOrderedList(
    config: Partial<OrderedListOptions> | '' | false
  ) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  //? Icon Path
  @Input() set cdmOrderedListIconPath(path: string) {
    this.iconPath.next(path);
  }
  iconPath = new BehaviorSubject<string | null>(null);

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<OrderedListOptions> | null>(null);
  button = new ComponentPortal(CdmOrderedListButton);

  extension = async () =>
    Promise.all([
      import('@tiptap/extension-ordered-list'),
      import('@tiptap/extension-list-item'),
    ]).then(([OrderedListModule, listItemModule]) => {
      return [
        OrderedListModule.OrderedList as any,
        listItemModule.ListItem as any,
      ];
    });
}

@Component({
  imports: [CommonModule],
  selector: 'cdm-ordered-list-button',
  template: ` <button (click)="onClick()">
    <img
      *ngIf="iconPath$ | async; else textOrderedList"
      [src]="iconPath$ | async"
      alt="Italic"
    />
    <ng-template #textOrderedList>Ordered List</ng-template>
  </button>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmOrderedListButton {
  editorService = inject(EditorService);
  iconPath$: BehaviorSubject<string | null>;
  constructor(private CdmOrderedListDirective: CdmOrderedListDirective) {
    this.iconPath$ = this.CdmOrderedListDirective.iconPath;
  }
  onClick() {
    this.editorService.exec((editor) =>
      editor.chain().focus().toggleOrderedList().run()
    );
  }
}
