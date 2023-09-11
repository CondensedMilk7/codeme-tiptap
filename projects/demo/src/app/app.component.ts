import { lowlight } from 'lowlight/lib/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <cdm-tiptap-editor
      [formControl]="content"
      tableClick
      [cdmHeading]="{ levels: [1, 2, 3] }"
      [cdmParagraph]="paragraphEnabled ? '' : false"
      [cdmTable]="{ resizable: true }"
      [cdmCode]="{ lowlight, languageClassPrefix: 'language-', HTMLAttributes: { class: 'code-block' } }"
      [cdmLink]="{ openOnClick: true, HTMLAttributes: { target: '_blank' } }"
      [cdmHiglight]="{}"
      [cdmBold]="{}"
      [cdmItalic]="{}"
      [cdmBulletList]="{}"
      [cdmOrderedList]="{}"
      [cdmVideo]="{}"
      [cdmBlockquote]="{}"
      [cdmUndo]="{}"
      [cdmRedo]="{}"
      cdmImage
      [cdmHiglightIconPath]="'NOT PROVIDED'"
      [cdmBoldIconPath]="'../assets/icons/bold-icon.svg'"
      [cdmBulletListIconPath]="'../assets/icons/bullet-list-icon.svg'"
      [cdmCodeIconPath]="'../assets/icons/code-icon.svg'"
      [cdmItalicIconPath]="'../assets/icons/italic-icon.svg'"
      [cdmLinkIconPath]="'../assets/icons/link-icon.svg'"
      [cdmBlockquoteIconPath]="'../assets/icons/blockquote-icon.svg'"
      [cdmOrderedListIconPath]="'../assets/icons/ordered-list-icon.svg'"
      [cdmUndoIconPath]="'../assets/icons/undo-icon.svg'"
      [cdmRedoIconPath]="'../assets/icons/redo-icon.svg'"
      [cdmVideoIconPath]="'../assets/icons/video-icon.svg'"
      [cdmTableIconPath]="'../assets/icons/table-icon.svg'"
      [cdmImageIconPath]="'../assets/icons/image-icon.svg'"
      [cdmHeadingIcons]="[
        '../assets/icons/h1-icon.svg',
        '../assets/icons/h2-icon.svg',
        '../assets/icons/h3-icon.svg'
      ]"
      [cdmLanguageConfig]="{
        javascript: true,
        html: true,
        css: true,
        typescript: true,
        python: true
      }"
    ></cdm-tiptap-editor>
    <div style="color: red" *ngIf="content.invalid">Invalid!</div>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  paragraphEnabled = false;
  content = new FormControl('initial value here', [Validators.required]);
  lowlight = lowlight;

  ngOnInit(): void {
    this.content.valueChanges.subscribe((val) =>
      console.log(this.content.valid)
    );
  }
}
