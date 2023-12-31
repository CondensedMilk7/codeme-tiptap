import { lowlight } from 'lowlight/lib/core';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CdmEndpointDirective, MarkStylesService } from 'codeme-tiptap';
import { Observable, map } from 'rxjs';

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
      [cdmHiglightIconPath]="'../assets/icons/italic-icon.svg'"
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
      [mark1Color]="mark1Color$ | async"
      [mark2Color]="mark2Color$ | async"
      [mark3Color]="mark3Color$ | async"
      [cdmLanguageConfig]="{
        javascript: true,
        html: true,
        css: true,
        typescript: true,
        python: true,
        java: true
      }"
      [cdmEndpoint]="'https://codemelive.com/api/editor/course/assignment/163b6569-6aca-44c7-b6c0-c3a676d7f808'"
      [data]="{ description: _dataToSend }"
      [debounceTime]="1000"
      [sendDatainChar]="50"
    ></cdm-tiptap-editor>
    <button (click)="onButtonClick()">Perform Action</button>
    <div style="color: red" *ngIf="content.invalid">Invalid!</div>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  paragraphEnabled = false;
  content = new FormControl('initial value here', [Validators.required]);
  @ViewChild(CdmEndpointDirective) cdmDirective!: CdmEndpointDirective;
  _dataToSend: string = '';

  lowlight = lowlight;
  markColorService = inject(MarkStylesService);
  markValues$!: Observable<any>;
  mark1Color$!: Observable<string>;
  mark2Color$!: Observable<string>;
  mark3Color$!: Observable<string>;

  onButtonClick() {
    this.cdmDirective.sendData();
  }
  ngOnInit(): void {
    this.content.valueChanges.subscribe((val) => {
      if (val) {
        this._dataToSend = val;
      }
    });

    // ? personaly i dont like this approach but it works
    this.markColorService.saveHexParameter('mark1', 'red');
    this.markColorService.saveHexParameter('mark2', '#00ff00');
    this.markColorService.saveHexParameter('mark3', '#0000ff');

    this.markValues$ = this.markColorService.getAllHexParameters();

    this.mark1Color$ = this.markValues$.pipe(map((colors) => colors.mark1));
    this.mark2Color$ = this.markValues$.pipe(map((colors) => colors.mark2));
    this.mark3Color$ = this.markValues$.pipe(map((colors) => colors.mark3));
  }
}
