import { lowlight } from 'lowlight/lib/core';
import { TableOverlayComponent } from 'projects/codeme-tiptap/src/lib/editor-feature/modals/table-overlay.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  NoopScrollStrategy,
  Overlay,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EditorService } from 'projects/codeme-tiptap/src/public-api';

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
      [cdmLanguageConfig]="{
        javascript: true,
        html: true,
        css: true,
        typescript: true,
        python: true
      }"
      [cdmBold]="{}"
      [cdmItalic]="{}"
      [cdmBulletList]="{}"
      [cdmOrderedList]="{}"
      [cdmVideo]="{}"
      [cdmLink]="{ openOnClick: true, HTMLAttributes: { target: '_blank' } }"
      [cdmBlockquote]="{}"
      [cdmUndo]="{}"
      [cdmRedo]="{}"
      cdmImage
      [cdmBoldIconPath]="'../assets/icons/bold-icon.svg'"
      [cdmBulletListIconPath]="'../assets/icons/bullet-list-icon.svg'"
      [cdmCodeIconPath]="'../assets/icons/code-icon.svg'"
      [cdmItalicIconPath]="'../assets/icons/italic-icon.svg'"
      [cdmHeadingIcons]="[
        '../assets/icons/h1-icon.svg',
        '../assets/icons/h2-icon.svg',
        '../assets/icons/h3-icon.svg'
      ]"
      [cdmLinkIconPath]="'../assets/icons/link-icon.svg'"
      [cdmBlockquoteIconPath]="'../assets/icons/blockquote-icon.svg'"
      [cdmOrderedListIconPath]="'../assets/icons/ordered-list-icon.svg'"
      [cdmUndoIconPath]="'../assets/icons/undo-icon.svg'"
      [cdmRedoIconPath]="'../assets/icons/redo-icon.svg'"
      [cdmVideoIconPath]="'../assets/icons/video-icon.svg'"
      [cdmTableIconPath]="'../assets/icons/table-icon.svg'"
      [cdmImageIconPath]="'../assets/icons/image-icon.svg'"
    ></cdm-tiptap-editor>
    <div style="color: red" *ngIf="content.invalid">Invalid!</div>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  paragraphEnabled = false;
  content = new FormControl('initial value here', [Validators.required]);
  lowlight = lowlight;
  constructor(private overlay: Overlay) {}

  ngOnInit(): void {
    this.content.valueChanges.subscribe((val) =>
      console.log(this.content.valid)
    );
  }
}
