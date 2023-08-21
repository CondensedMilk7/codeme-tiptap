import { Component, DestroyRef, forwardRef, inject } from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorService } from './editor.service';

@Component({
  selector: 'cdm-tiptap-editor',
  providers: [
    EditorService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodemeTiptapComponent),
      multi: true,
    },
  ],
  template: `
    <cdm-editor-toolbar [editor]="editor"></cdm-editor-toolbar>
    <tiptap-editor
      [editor]="editor"
      [ngModel]="value"
      [cdmHeading]="{ levels: [1, 2, 3] }"
      (ngModelChange)="setValue($event)"
    ></tiptap-editor>
  `,
  styles: [],
})
export class CodemeTiptapComponent implements ControlValueAccessor {
  editorService = inject(EditorService);
  destroyRef = inject(DestroyRef);

  value = '';

  editor = this.editorService.getEditor(this.destroyRef);

  setValue(value: string) {
    this.value = value;
    this.onChange(value);
  }

  onChange = (value: string) => {};
  onTouch = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
