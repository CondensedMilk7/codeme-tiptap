import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class EditorFeature {
  abstract enabled: Observable<boolean>;
  abstract config: Observable<any>;
  abstract extension: () => Promise<any>;
}

export const EDITOR_FEATURE = new InjectionToken<EditorFeature>(
  'EDITOR_FEATURE'
);
