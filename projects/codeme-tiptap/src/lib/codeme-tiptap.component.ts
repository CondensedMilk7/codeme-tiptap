import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorService } from './editor.service';
import { BehaviorSubject } from 'rxjs';
import { Editor } from '@tiptap/core';

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
    <ng-container *ngIf="editor$ | async as editor">
      <cdm-editor-toolbar></cdm-editor-toolbar>
      <tiptap-editor
        [editor]="editor"
        [ngModel]="value"
        (ngModelChange)="setValue($event)"
      ></tiptap-editor>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodemeTiptapComponent implements ControlValueAccessor {
  editorService = inject(EditorService);

  value = '';

  editor$ = this.editorService.editor$ as BehaviorSubject<Editor>;

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
