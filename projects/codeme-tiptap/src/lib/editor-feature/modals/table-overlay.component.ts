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
  constructor(public editorService: EditorService) {}

  ngOnInit(): void {}

  insertRow(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.editorService.editor) {
      // this.editorService.exec((editor) => {
      //   editor.chain().focus().addRowAfter().run();
      // });

      alert('insert row');
    } else {
      alert('no editor');
    }
  }

  @HostListener('click', ['$event'])
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
