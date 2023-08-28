import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'table-modal',
  template: `
    <form [formGroup]="tableForm">
      <div>
        <label for="rows">Rows:</label>
        <input id="rows" formControlName="rows" type="number" />
      </div>
      <div>
        <label for="cols">Columns:</label>
        <input id="cols" formControlName="cols" type="number" />
      </div>
    </form>
  `,
})
export class TableModalComponent implements OnInit {
  tableForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.tableForm = this.fb.group({
      rows: [null, Validators.required],
      cols: [null, Validators.required],
    });
  }

  submitForm() {
    if (this.tableForm.valid) {
      return this.tableForm.value;
    }
    return null;
  }
}
