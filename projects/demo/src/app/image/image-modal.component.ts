import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';
import { SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule, ImageCropperModule],
  standalone: true,
  selector: 'app-image-modal',
  template: `
    <div class="container">
      <input
        type="file"
        (change)="fileChangeEvent($event)"
        class="file-input"
      />

      <label for="preview-width">Preview Width: {{ previewWidth }}px</label>
      <input
        type="range"
        id="preview-width"
        [ngModel]="previewWidth"
        (mouseup)="updateCropperOnMouseUp($event)"
        min="100"
        max="600"
        class="slider"
      />
      <label for="caption">Caption:</label>
      <input [(ngModel)]="caption" type="text" placeholder="Enter caption" />

      <div class="wrap">
        <image-cropper
          [style.width.px]="previewWidth"
          *ngIf="showCropper"
          [imageChangedEvent]="imageChangedEvent"
          [maintainAspectRatio]="false"
          [aspectRatio]="aspectRatio"
          format="png"
          [resizeToWidth]="resizeSettings.width"
          (imageCropped)="imageCropped($event)"
          class="image-cropper"
        >
        </image-cropper>
      </div>

      <div class="img_wrapper">
        <button
          nz-button
          nzType="primary"
          (click)="submitForm()"
          class="submit-button"
        >
          Submit
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .file-input {
        margin-bottom: 20px;
      }

      .wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;

        img {
          width: 100%;
          height: 100%;
          flex-shrink: 0;
        }
      }

      .image-cropper {
        width: 100%;
        max-width: 600px;
        height: auto;
      }

      .preview-image {
        height: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .submit-button {
        align-self: center;
      }

      .slider {
        width: 100%;
        height: 15px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .slider:hover {
        opacity: 1;
      }

      .slider::-webkit-slider-thumb {
        appearance: none;
        width: 25px;
        height: 25px;
        background: #4caf50;
        cursor: pointer;
        border-radius: 50%;
      }

      .slider::-moz-range-thumb {
        width: 25px;
        height: 25px;
        background: #4caf50;
        cursor: pointer;
        border-radius: 50%;
      }

      .img_wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class ImageModalComponent {
  imageUrl!: string;
  aspectRatio = 1;
  previewWidth = 200;
  resizeSettings = { width: this.previewWidth };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = true;
  @Input() image!: string; // Change the name of the input property to match
  @Input() caption: string = '';

  constructor(private modalRef: NzModalRef, private sanitizer: DomSanitizer) {
    const modalComponentParams = modalRef.getConfig().nzComponentParams;
    this.image = modalComponentParams?.['image'];
    this.caption = modalComponentParams?.['caption']; // Ensure the caption is retrieved
  }

  submitForm(): void {
    this.modalRef.close({
      croppedImage: this.croppedImage,
      caption: this.caption,
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.croppedImage = this.sanitizer.bypassSecurityTrustResourceUrl(
        fileReader.result as string
      );
    };
    if (event.blob) {
      fileReader.readAsDataURL(event.blob);
    }
  }

  ngOnInit() {
    const sanitizedSrc = this.image;
    const actualSrc =
      this.sanitizer.sanitize(SecurityContext.URL, sanitizedSrc) || '';
    const blob = this.dataURItoBlob(actualSrc);
    const blobUrl = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      this.previewWidth = img.width;

      this.resizeSettings = { width: this.previewWidth };

      this.forceCropperRerender();
    };
    img.src = blobUrl;

    this.imageChangedEvent = {
      target: {
        files: [new File([blob], 'filename', { type: 'image/png' })],
      },
    };
  }

  dataURItoBlob(dataURI: any) {
    // Unwrap the safe value
    const actualDataURI =
      this.sanitizer.sanitize(SecurityContext.URL, dataURI) || '';

    console.log('actualDataURI before split:', actualDataURI); // Log the unwrapped dataURI

    const parts = actualDataURI.split(',');
    if (parts.length !== 2) {
      throw new Error('Invalid data URI');
    }
    console.log('Base64 part:', parts[1]);

    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  updateCropper(width: number) {
    this.previewWidth = width;
    this.resizeSettings = { width: this.previewWidth };
    this.forceCropperRerender();
  }
  updateCropperOnMouseUp(event: any): void {
    const width = event.target.valueAsNumber;
    this.updateCropper(width);
  }

  forceCropperRerender() {
    this.showCropper = false;
    setTimeout(() => (this.showCropper = true), 0);
  }
}
