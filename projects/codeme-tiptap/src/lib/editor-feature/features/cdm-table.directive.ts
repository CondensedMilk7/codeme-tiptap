import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  inject,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { EDITOR_FEATURE, EditorFeature } from '../editor-feature';
import { BehaviorSubject, take } from 'rxjs';
import Table, { TableOptions } from '@tiptap/extension-table';
import TableRow, { TableRowOptions } from '@tiptap/extension-table-row';
import TableCell, { TableCellOptions } from '@tiptap/extension-table-cell';
import TableHeader, {
  TableHeaderOptions,
} from '@tiptap/extension-table-header';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { EditorService } from '../../editor.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TableModalComponent } from '../modals/table-modal.component';
import { Editor, Node as ProsemirrorNode } from '@tiptap/core';

//? Combining Table Options Because We only cant pass more than 2
export interface CombinedTableOptions
  extends TableOptions,
    TableRowOptions,
    TableCellOptions,
    TableHeaderOptions {}

@Directive({
  standalone: true,
  selector: 'cdm-tiptap-editor[cdmTable], tiptap-editor[cdmTable]',
  providers: [
    {
      provide: EDITOR_FEATURE,
      useExisting: CdmTableDirective,
      multi: true,
    },
  ],
})
export class CdmTableDirective implements EditorFeature<CombinedTableOptions> {
  @Input() set cdmTable(config: Partial<TableOptions> | '' | false) {
    this.enabled.next(config !== false);
    this.config.next(config || null);
  }

  enabled = new BehaviorSubject(false);
  config = new BehaviorSubject<Partial<TableOptions> | null>(null);
  button = new ComponentPortal(CdmTableButton);

  extension = async (): Promise<any[]> => {
    const [
      tableModule,
      tableRowModule,
      tableCellModule,
      tableHeaderModule,
      Gapcursor,
    ] = await Promise.all([
      import('@tiptap/extension-table'),
      import('@tiptap/extension-table-row'),
      import('@tiptap/extension-table-cell'),
      import('@tiptap/extension-table-header'),
      import('@tiptap/extension-gapcursor'),
    ]);

    return [
      tableModule.Table,
      tableRowModule.TableRow,
      tableCellModule.TableCell,
      tableHeaderModule.TableHeader,
      Gapcursor.Gapcursor,
    ];
  };
}

@Component({
  selector: 'cdm-table-button',
  template: ` <button (click)="onClick()">Table</button> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdmTableButton {
  editorService = inject(EditorService);
  @Output() tableClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NzModalService,
    private messageService: NzMessageService
  ) {}

  onClick() {
    this.applyTable();
  }

  applyTable(): void {
    const modal = this.modalService.create({
      nzContent: TableModalComponent,
      nzClosable: false,
      nzOnOk: (componentInstance) => componentInstance.submitForm(),
    });

    modal.afterClose.subscribe((tableData) => {
      if (tableData) {
        const { rows, cols } = tableData;
        if (rows > 0 && cols > 0) {
          this.editorService.exec((editor) => {
            console.log('table', editor.chain().focus());
            editor
              .chain()
              .focus()
              .insertTable({ rows: rows, cols: cols, withHeaderRow: true })
              .run();
          });
        } else {
          this.messageService.create(
            'error',
            `Invalid input. Please ensure rows and columns are greater than 0.`
          );
        }
      }
    });
  }
}
