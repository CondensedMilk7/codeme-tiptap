import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

// Validator
// TODO: Take this out
function httpsValidator(control: FormControl): { [s: string]: boolean } | null {
  if (control.value && !control.value.startsWith('https')) {
    return { notHttps: true };
  }
  return null;
}

@Component({
  selector: 'table-modal',
  template: `
    <form [formGroup]="formGroup">
      <div nz-row>
        <div nz-col nzSpan="24">
          <h2 nz-title>Enter URL</h2>
        </div>
        <div nz-col nzSpan="24" nz-content>
          <input
            nz-input
            formControlName="url"
            style="width: 100%; border: 1px solid #cfcfcf; box-shadow: none; background-color: #fff; padding: 5px;"
          />
        </div>
      </div>
    </form>
  `,
})
export class LinkModalComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private modalRef: NzModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      url: ['', [Validators.required, httpsValidator]],
    });
  }

  get urlControl(): FormControl {
    return this.formGroup.get('url') as FormControl;
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.modalRef.close(this.urlControl.value);
    }
  }

  cancel(): void {
    this.modalRef.triggerCancel();
  }
}
