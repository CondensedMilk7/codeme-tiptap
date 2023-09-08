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
      [cdmTable]="{ resizable: true }"
      [cdmCode]="{ lowlight, languageClassPrefix: 'language-', HTMLAttributes: { class: 'code-block' } }"
      [cdmBold]="{}"
      [cdmItalic]="{}"
      [cdmBulletList]="{}"
      [cdmOrderedList]="{}"
      [cdmVideo]="{}"
      [cdmLink]="{ openOnClick: true, HTMLAttributes: { target: '_blank' } }"
      tableClick
      (tableClicked)="onTableClicked()"
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
      [cdmOrderedListIconPath]="'../assets/icons/ordered-list-icon.svg'"
    ></cdm-tiptap-editor>
    <div style="color: red" *ngIf="content.invalid">Invalid!</div>
  `,
  styles: [``],
})
export class AppComponent implements OnInit {
  paragraphEnabled = false;
  content = new FormControl('initial value here', [Validators.required]);
  //? getting lowlight
  lowlight = lowlight;
  constructor(private editorService: EditorService, private overlay: Overlay) {}

  ngOnInit(): void {
    this.content.valueChanges.subscribe((val) =>
      console.log(this.content.valid)
    );
  }

  onTableClicked() {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: false,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy,
      scrollStrategy: new NoopScrollStrategy(),
    });

    const overlayRef = this.overlay.create(overlayConfig);

    const componentPortal = new ComponentPortal(TableOverlayComponent);
    const componentRef = overlayRef.attach(componentPortal);
    componentRef.instance.editorService = this.editorService; // Passing the service instance

    overlayRef.backdropClick().subscribe((event) => {
      const clickedElement = event.target as HTMLElement;
      if (!overlayRef.overlayElement.contains(clickedElement)) {
        overlayRef.detach();
      }
    });
  }
}
