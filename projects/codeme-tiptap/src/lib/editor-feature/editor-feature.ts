import { InjectionToken } from '@angular/core';
import { Node } from '@tiptap/core';
import { Observable } from 'rxjs';
import { Portal } from '@angular/cdk/portal';

export abstract class EditorFeature<ConfigType = any, StorageType = any> {
  abstract enabled: Observable<boolean>;
  abstract config: Observable<Partial<ConfigType> | null>;
  abstract extension: () => Promise<
    Node<ConfigType, StorageType> | Node<ConfigType, StorageType>[]
  >;
  abstract button?: Portal<any>;
}

export const EDITOR_FEATURE = new InjectionToken<EditorFeature>(
  'EDITOR_FEATURE'
);
