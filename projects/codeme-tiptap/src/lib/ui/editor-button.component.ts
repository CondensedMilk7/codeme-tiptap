import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cdm-editor-button',
  template: `
    <div class="">
      <button nz-button (click)="clickHandler()" class="editor-btn">
        <ng-container *ngIf="imagePath">
          <img [src]="imagePath" alt="{{ label }}" />
        </ng-container>
        <ng-container *ngIf="iconClass && !imagePath">
          <i [ngClass]="iconClass" [style.color]="iconColor"></i>
          <!-- Apply the color here -->
        </ng-container>
        {{ label }}
      </button>
    </div>
  `,
  styles: [],
})
export class EditorButtonComponent {
  @Input() label!: string;
  @Input() iconClass?: string;
  @Input() imagePath?: string;
  @Input() iconColor: string = '#000000';
  @Output() onClick = new EventEmitter<void>();

  clickHandler(): void {
    this.onClick.emit();
  }
}
