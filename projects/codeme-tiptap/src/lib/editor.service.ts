import { Injectable, inject } from '@angular/core';
import { Editor, Node } from '@tiptap/core';
import { EDITOR_FEATURE, EditorFeature } from './editor-feature/editor-feature';
import { Observable, combineLatest, from, map, of, switchMap, tap } from 'rxjs';
import StarterKit from '@tiptap/starter-kit';
import { Portal } from '@angular/cdk/portal';

@Injectable()
export class EditorService {
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

  extensions$: Observable<(Node<any, any> | Node<any, any>)[]> = combineLatest(
    this.features$
  ).pipe(
    map((extensionsArray) => {
      return extensionsArray.flat().filter(Boolean) as (
        | Node<any, any>
        | Node<any, any>
      )[];
    })
  );

  get editor$(): Observable<Editor> {
    return this.extensions$.pipe(
      map(
        (extensions) => new Editor({ extensions: [StarterKit, ...extensions] })
      ),
      tap((editor) => {
        console.log(editor.chain());
      })
    );
  }
}
