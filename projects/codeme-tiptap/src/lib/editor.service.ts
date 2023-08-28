import { Injectable, DestroyRef, inject } from '@angular/core';
import { Editor } from '@tiptap/core';
import { EDITOR_FEATURE, EditorFeature } from './editor-feature/editor-feature';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import StarterKit from '@tiptap/starter-kit';
import { Portal } from '@angular/cdk/portal';

@Injectable()
export class EditorService {
  editor!: Editor;
  features = inject<EditorFeature[]>(EDITOR_FEATURE, { optional: true }) || [];
  buttons: Portal<any>[] = this.features
    .filter((feat) => feat.button)
    // features are filtered, so button cannot be undefined
    .map((feat) => feat.button as Portal<any>);

  private features$ = this.features.map(({ enabled, extension, config }) =>
    combineLatest([enabled, config]).pipe(
      switchMap(([enabled, cfg]) =>
        enabled
          ? from(extension()).pipe(
              map((extArray) => {
                if (Array.isArray(extArray)) {
                  return extArray.map((ext) => ext.configure(cfg || {}));
                }
                return extArray.configure(cfg || {});
              })
            )
          : of(null)
      )
    )
  );

  extensions$: Observable<any> = combineLatest(this.features$).pipe(
    map((extensionsArray) => {
      return extensionsArray.flat().filter(Boolean);
    })
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
}
