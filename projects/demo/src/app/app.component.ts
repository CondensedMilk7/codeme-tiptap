import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="paragraphEnabled = !paragraphEnabled">
      Toggle Paragraph
    </button>
    <ul>
      <li>Paragraph: {{ paragraphEnabled }}</li>
    </ul>
    <cdm-tiptap-editor
      [formControl]="content"
      [cdmHeading]="{ levels: [1, 2, 3] }"
      [cdmParagraph]="paragraphEnabled ? '' : false"
    ></cdm-tiptap-editor>
    <div style="color: red" *ngIf="content.invalid">Invalid!</div>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  paragraphEnabled = false;
  content = new FormControl('initial value here', [Validators.required]);

  ngOnInit(): void {
    this.content.valueChanges.subscribe((val) =>
      console.log(this.content.valid)
    );
  }
}
