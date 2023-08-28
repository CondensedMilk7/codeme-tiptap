import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EditorService } from '../editor.service';

@Component({
  selector: 'cdm-editor-toolbar',
  template: `
    <div class="button-group">
      <ng-template
        *ngFor="let button of buttons"
        [cdkPortalOutlet]="button"
      ></ng-template>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorToolbarComponent {
  editorService = inject(EditorService);
  buttons = this.editorService.buttons;
}
