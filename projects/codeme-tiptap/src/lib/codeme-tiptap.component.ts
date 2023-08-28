import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditorService } from './editor.service';
import { BehaviorSubject } from 'rxjs';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

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
    <cdm-editor-toolbar></cdm-editor-toolbar>
    <tiptap-editor
      [editor]="(editor$ | async) ?? fallbackEditor()"
      [ngModel]="value"
      (ngModelChange)="setValue($event)"
    ></tiptap-editor>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodemeTiptapComponent implements ControlValueAccessor {
  editorService = inject(EditorService);

  // TODO: make bare editor use no extensions at all.
  // !! ngx-tiptap-editor throws if no extensions are provided
  value = '';

  editor$ = this.editorService.editor$ as BehaviorSubject<Editor>;

  fallbackEditor() {
    return new Editor({ extensions: [StarterKit] });
  }

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
