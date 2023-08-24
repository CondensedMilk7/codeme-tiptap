import { Injectable, DestroyRef, inject } from '@angular/core';
import { Editor } from '@tiptap/core';
import { EDITOR_FEATURE, EditorFeature } from './editor-feature/editor-feature';
import { Observable, combineLatest, from, map, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import StarterKit from '@tiptap/starter-kit';

@Injectable()
export class EditorService {
  editor!: Editor;

  features = inject<EditorFeature[]>(EDITOR_FEATURE, { optional: true }) || [];

  private features$ = this.features.map(({ enabled, extension, config }) =>
    combineLatest([enabled, config]).pipe(
      switchMap(([enabled, cfg]) =>
        enabled
          ? from(extension()).pipe(map((ext) => ext.configure(cfg || {})))
          : Promise.resolve()
      )
    )
  );

  // TODO: Introduce at least some type safety for extension
  extensions$: Observable<any> = combineLatest(this.features$).pipe(
    map((extensions) => extensions.filter(Boolean))
  );

  getEditor(destroyRef: DestroyRef): Editor {
    this.editor = new Editor({
      extensions: [StarterKit],
    });

    this.registerExtensions(destroyRef);

    return this.editor;
  }

  registerExtensions(destroyRef: DestroyRef) {
    return this.extensions$
      .pipe(
        takeUntilDestroyed(destroyRef),
        tap((extensions) => console.log('Registered extensions: ', extensions)),
        tap((extensions) => (this.editor.options.extensions = [...extensions]))
      )
      .subscribe();
  }

  applyHeading(editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6): void {
    editor.chain().focus().toggleHeading({ level }).run();
  }

  applyBlockquote(editor: Editor): void {
    editor.chain().focus().toggleBlockquote().run();
  }

  applyCodeBlock(editor: Editor): void {
    editor.chain().focus().toggleCodeBlock().run();
  }

  applyBold(editor: Editor): void {
    editor.chain().focus().toggleBold().run();
  }

  applyItalic(editor: Editor): void {
    editor.chain().focus().toggleItalic().run();
  }

  applyBulletList(editor: Editor): void {
    editor.chain().focus().toggleBulletList().run();
  }

  applyOrderedList(editor: Editor): void {
    editor.chain().focus().toggleOrderedList().run();
  }

  addMark(editor: Editor) {
    editor.chain().focus().toggleMark('highlight').run();
  }

  goBack(editor: Editor) {
    editor.chain().focus().undo().run();
  }

  goForward(editor: Editor) {
    editor.chain().focus().redo().run();
  }

  getHtml(editor: Editor) {
    const html = editor.getJSON();
    console.log(html);
  }

  addCustoMark(editor: Editor) {
    editor
      .chain()
      .focus()
      .toggleMark('highlightColor', { class: 'mark1' })
      .run();
  }

  addCustoMark2(editor: Editor) {
    editor
      .chain()
      .focus()
      .toggleMark('highlightColor', { class: 'mark2' })
      .run();
  }
}
