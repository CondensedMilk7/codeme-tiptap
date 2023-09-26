import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TableOverlayComponent } from 'projects/codeme-tiptap/src/lib/editor-feature/modals/table-overlay.component';
import { EditorService } from 'codeme-tiptap';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[tableClick]',
})
export class TableClickDirective {
  @Output() tableClicked: EventEmitter<void> = new EventEmitter<void>();
  private overlayRef: OverlayRef | null = null;

  constructor(
    private el: ElementRef,
    private overlay: Overlay,
    private editorService: EditorService
  ) {}

  getCallbackMap() {
    return {
      deleteTable: this.deleteTable.bind(this),
      addRowAfter: this.addRowAfter.bind(this),
      deleteRow: this.deleteRow.bind(this),
      addColumnAfter: this.addColumnAfter.bind(this),
      deleteColumn: this.deleteColumn.bind(this),
      mergeCells: this.mergeCells.bind(this),
      splitCell: this.splitCell.bind(this),
    };
  }

  // TODO: Move These Somewhere Else
  // TODO: Maybe Refactor To dont use callbacks
  deleteTable(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().deleteTable().run();
      });
    } else {
      alert('No editor found');
    }
  }

  addRowAfter(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().addRowAfter().run();
      });
    } else {
      alert('No editor found');
    }
  }

  deleteRow(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().deleteRow().run();
      });
    } else {
      alert('No editor found');
    }
  }

  addColumnAfter(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().addColumnAfter().run();
      });
    } else {
      alert('No editor found');
    }
  }

  deleteColumn(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().deleteColumn().run();
      });
    } else {
      alert('No editor found');
    }
  }

  mergeCells(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().mergeCells().run();
      });
    } else {
      alert('No editor found');
    }
  }

  splitCell(): void {
    if (this.editorService.editor) {
      this.editorService.exec((editor: any) => {
        editor.chain().focus().splitCell().run();
      });
    } else {
      alert('No editor found');
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    let clickedInside = this.el.nativeElement.contains(event.target);
    if (clickedInside) {
      const el = event.target as HTMLElement;
      let currentEl: HTMLElement | null = el;
      while (currentEl && currentEl !== this.el.nativeElement) {
        if (currentEl.tagName === 'TD' || currentEl.tagName === 'TABLE') {
          this.tableClicked.emit();
          this.showOverlay(currentEl);
          break;
        }
        currentEl = currentEl.parentElement;
      }
    }
  }

  private showOverlay(element: HTMLElement): void {
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

    const overlayComponentPortal = new ComponentPortal(TableOverlayComponent);
    const component = this.overlayRef.attach(overlayComponentPortal);
    component.instance.editorService = this.editorService as any;
    component.instance.callbackMap = this.getCallbackMap();

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
    });
  }
}
