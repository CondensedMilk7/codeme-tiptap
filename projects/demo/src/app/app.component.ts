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

// Registering the lowlight language
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import typescript from 'highlight.js/lib/languages/typescript';

lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('typescript', typescript);

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
      [cdmUndo]="{}"
      [cdmRedo]="{}"
      cdmImage
      tableClick
      (tableClicked)="onTableClicked()"
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
