import { Component, OnInit, HostListener, inject } from '@angular/core';
import { EditorService } from '../../editor.service';

@Component({
  selector: 'table-overlay',
  template: `<button (click)="insertRow($event)">Insert Row</button>`,

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
  constructor(private editorService: EditorService) {}

  insertRow(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.editorService.editor) {
      alert('editor exists');
    } else {
      alert('editor does not exist');
    }
    this.editorService.editor?.chain().focus().addRowAfter().run();
  }

  @HostListener('click', ['$event'])
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
