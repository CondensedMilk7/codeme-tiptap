import { Component, OnInit, HostListener, inject } from '@angular/core';
import { EditorService } from '../../editor.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'table-overlay',
  template: `<button (click)="insertRow($event)">Insert Row</button>`,
  standalone: true,
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
    console.log(this.editorService);
    if (this.editorService.editor) {
      this.editorService.exec((editor) => {
        editor.chain().focus().addRowAfter().run();
      });
    } else {
      console.error('no editor');
    }
  }

  @HostListener('click', ['$event'])
  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
  }
}
