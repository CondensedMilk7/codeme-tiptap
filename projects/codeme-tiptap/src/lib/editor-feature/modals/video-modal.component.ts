import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

// Validator

function youtubeUrlValidator(
  control: FormControl
): { [key: string]: any } | null {
  const url = control.value;
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  const isValid = youtubeRegex.test(url);

  return isValid ? null : { youtubeUrl: { value: control.value } };
}

@Component({
  selector: 'video-modal',
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="submit()">
      <input formControlName="videoUrl" placeholder="Enter YouTube video URL" />
    </form>
  `,
})
export class VideoModalComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(private modalRef: NzModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      videoUrl: ['', [Validators.required, youtubeUrlValidator]],
    });
  }

  submit(): void {
    if (this.formGroup.valid) {
      this.modalRef.close(this.formGroup.value.videoUrl);
    }
  }
}
