import {
  Directive,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[tableClick]',
})
export class TableClickDirective {
  @Output() tableClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    let clickedInside = this.el.nativeElement.contains(event.target);
    if (clickedInside) {
      const el = event.target as HTMLElement;
      let currentEl: HTMLElement | null = el;
      while (currentEl && currentEl !== this.el.nativeElement) {
        if (currentEl.tagName === 'TD' || currentEl.tagName === 'TABLE') {
          this.tableClicked.emit();
          break;
        }
        currentEl = currentEl.parentElement;
      }
    }
  }
}
