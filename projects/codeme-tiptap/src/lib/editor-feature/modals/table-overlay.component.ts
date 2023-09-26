import { Component, OnInit, HostListener, Inject, Input } from '@angular/core';
import { EditorService } from '../../editor.service';

@Component({
  selector: 'table-overlay',
  template: `
    <button (click)="invokeCallback('deleteTable')">Delete Table</button>
    <button (click)="invokeCallback('addRowAfter')">Add Row After</button>
    <button (click)="invokeCallback('deleteRow')">Delete Row</button>
    <button (click)="invokeCallback('addColumnAfter')">Add Column After</button>
    <button (click)="invokeCallback('deleteColumn')">Delete Column</button>
    <button (click)="invokeCallback('mergeCells')">Merge Cells</button>
    <button (click)="invokeCallback('splitCell')">Split Cell</button>
  `,
  styles: [
    `
      button {
        background: red;
        z-index: 500;
      }
    `,
  ],
})
export class TableOverlayComponent {
  @Input() editorService!: EditorService;
  @Input() callbackMap!: Record<string, () => void>;

  invokeCallback(action: string) {
    this.callbackMap[action]?.();
  }
}
