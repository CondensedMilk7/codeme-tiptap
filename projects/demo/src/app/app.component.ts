import { TableOverlayComponent } from 'projects/codeme-tiptap/src/lib/editor-feature/modals/table-overlay.component';
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  NoopScrollStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
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
  constructor(private editorService: EditorService) {}
  overlay = inject(Overlay);

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
    overlayRef.backdropClick().subscribe((event) => {
      const clickedElement = event.target as HTMLElement;
      if (!overlayRef.overlayElement.contains(clickedElement)) {
        overlayRef.detach();
      }
    });

    const componentPortal = new ComponentPortal(TableOverlayComponent);
    overlayRef.attach(componentPortal);
  }
}
