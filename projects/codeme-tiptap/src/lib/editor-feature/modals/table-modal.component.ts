import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'table-modal',
  template: `
    <form [formGroup]="tableForm">
      <div class="counter">Selected: {{ selectedRow }} x {{ selectedCol }}</div>
      <div *ngFor="let row of rows; let i = index" class="row">
        <div *ngFor="let col of cols; let j = index" class="col">
          <div
            class="cube"
            [class.selected]="isSelected(i, j)"
            [class.hover]="isHover(i, j)"
            (click)="selectCube(i, j)"
            (mouseover)="hoverCube(i, j)"
            (mouseout)="unhoverCube()"
          ></div>
        </div>
      </div>
    </form>
    <style>
      .row {
        display: flex;
        margin-bottom: 4px;
      }
      .col {
        width: 24px;
        height: 24px;
        margin-right: 4px;
        transition: all 0.2s ease;
      }
      .cube {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: 1px solid #ccc;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      .selected {
        background-color: #4caf50;
        border-color: #388e3c;
      }
      .hover {
        background-color: #ffc107;
      }
      .counter {
        font-size: 1.2em;
        margin-bottom: 20px;
        font-weight: bold;
      }
    </style>
  `,
  standalone: true,
})
export class TableModalComponent implements OnInit {
  tableForm!: FormGroup;
  rows: any[] = new Array(10).fill(0);
  cols: any[] = new Array(10).fill(0);
  selectedRow = 0;
  selectedCol = 0;
  hoverRow = 0;
  hoverCol = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tableForm = this.fb.group({
      rows: [null, Validators.required],
      cols: [null, Validators.required],
    });
  }

  selectCube(row: number, col: number) {
    this.selectedRow = row + 1;
    this.selectedCol = col + 1;
    this.tableForm.patchValue({
      rows: this.selectedRow,
      cols: this.selectedCol,
    });
  }

  hoverCube(row: number, col: number) {
    this.hoverRow = row + 1;
    this.hoverCol = col + 1;
  }

  unhoverCube() {
    this.hoverRow = 0;
    this.hoverCol = 0;
  }

  isSelected(row: number, col: number) {
    return row < this.selectedRow && col < this.selectedCol;
  }

  isHover(row: number, col: number) {
    return (
      row < this.hoverRow && col < this.hoverCol && !this.isSelected(row, col)
    );
  }

  submitForm() {
    if (this.tableForm.valid) {
      return this.tableForm.value;
    }
    return null;
  }
}
