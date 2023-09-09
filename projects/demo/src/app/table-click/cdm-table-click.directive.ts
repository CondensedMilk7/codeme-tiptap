import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  Injector,
} from '@angular/core';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TableOverlayComponent } from 'projects/codeme-tiptap/src/lib/editor-feature/modals/table-overlay.component';
import { EditorService } from 'codeme-tiptap';

@Directive({
  selector: '[tableClick]',
})
export class TableClickDirective {
  @Output() tableClicked: EventEmitter<void> = new EventEmitter<void>();
  private overlayRef: OverlayRef | null = null;

  insertRow(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().addRowAfter().run();
      });
    } else {
      alert('No editor found');
    }
  }
  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private injector: Injector,
    private editorService: EditorService
  ) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    let clickedInside = this.el.nativeElement.contains(event.target);
    if (clickedInside) {
      const el = event.target as HTMLElement;
      let currentEl: HTMLElement | null = el;
      while (currentEl && currentEl !== this.el.nativeElement) {
        if (currentEl.tagName === 'TD' || currentEl.tagName === 'TABLE') {
          this.tableClicked.emit();
          this.showOverlay(currentEl, this.editorService);
          break;
        }
        currentEl = currentEl.parentElement;
      }
    }
  }

  private showOverlay(
    element: HTMLElement,
    editorService: EditorService
  ): void {
    if (this.editorService.editor) {
      alert('Editor Found');
    } else {
      alert('No Editor Found');
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(element)
      .withPositions([
        { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
      ]);

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'overlay-panel',
      scrollStrategy: this.overlay.scrollStrategies.close(),
      positionStrategy,
    });

    this.overlayRef = this.overlay.create(overlayConfig);

    const overlayComponentPortal = new ComponentPortal(
      TableOverlayComponent,
      null,
      this.createInjector(editorService)
    );

    const component = this.overlayRef.attach(overlayComponentPortal);
    component.instance.callback = this.insertRow.bind(this);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
    });
  }

  private createInjector(editorService: EditorService): Injector {
    return Injector.create({
      providers: [
        { provide: 'overlayRef', useValue: this.overlayRef },
        { provide: EditorService, useValue: editorService },
      ],
      parent: this.injector,
    });
  }
}
