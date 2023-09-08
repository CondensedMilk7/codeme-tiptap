import { ComponentPortal } from '@angular/cdk/portal';
import { Directive, Input, Component, ChangeDetectionStrategy, inject, Output, EventEmitter } from '@angular/core';
import { TableOptions } from '@tiptap/extension-table';
import { TableCellOptions } from '@tiptap/extension-table-cell';
import { TableHeaderOptions } from '@tiptap/extension-table-header';
import { TableRowOptions } from '@tiptap/extension-table-row';
import { EDITOR_FEATURE, EditorFeature, EditorService } from 'codeme-tiptap';
import { TableModalComponent } from 'projects/codeme-tiptap/src/lib/editor-feature/modals/table-modal.component'
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';


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
