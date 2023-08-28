import { NgModule } from '@angular/core';
import { CodemeTiptapComponent } from './codeme-tiptap.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { EditorToolbarComponent } from './ui/editor-toolbar.component';
import { CdmHeadingDirective } from './editor-feature';
import { CdmParagraphDirective } from './editor-feature';
import { PortalModule } from '@angular/cdk/portal';
import { CdmTableDirective } from './editor-feature/features/cdm-table.directive';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModalComponent } from './editor-feature/modals/table-modal.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    CodemeTiptapComponent,
    EditorToolbarComponent,
    TableModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxTiptapModule,
    PortalModule,
    CdmHeadingDirective,
    CdmParagraphDirective,
    CdmTableDirective,
    NzModalModule,
    NzMessageModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  exports: [
    CodemeTiptapComponent,
    CdmHeadingDirective,
    CdmParagraphDirective,
    CdmTableDirective,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],

})
export class CodemeTiptapModule {}
