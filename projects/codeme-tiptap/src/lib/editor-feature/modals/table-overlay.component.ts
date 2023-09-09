import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { EditorService } from '../../editor.service';

@Component({
  selector: 'table-overlay',
  template: `<button (click)="invokeCallback()">Insert Row</button>`,
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
  callback: Function = () => {};

  invokeCallback() {
    this.callback();
  }
}
