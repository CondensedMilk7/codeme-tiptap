import { NgModule } from '@angular/core';
import { CodemeTiptapComponent } from './codeme-tiptap.component';
import { NgxTiptapModule } from 'ngx-tiptap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { EditorToolbarComponent } from './ui/editor-toolbar.component';
import {
  CdmBulletListDirective,
  CdmCodeDirective,
  CdmHeadingDirective,
  CdmLinkDirective,
  CdmItalicDirective,
  CdmBoldDirective,
  CdmOrderedListDirective,
  CdmVideoDirective,
  CdmGoForwardDirective,
  CdmGoBackDirective,
} from './editor-feature';
import { CdmParagraphDirective } from './editor-feature';
import { PortalModule } from '@angular/cdk/portal';
import { CdmTableDirective } from './editor-feature/features/cdm-table.directive';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModalComponent } from './editor-feature/modals/table-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableOverlayComponent } from './editor-feature/modals/table-overlay.component';
import { LinkModalComponent } from './editor-feature/modals/link-modal.component';
import { VideoModalComponent } from './editor-feature/modals/video-modal.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    CodemeTiptapComponent,
    EditorToolbarComponent,
    TableModalComponent,
    TableOverlayComponent,
    LinkModalComponent,
    VideoModalComponent,
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
    CdmCodeDirective,
    CdmLinkDirective,
    CdmBoldDirective,
    CdmItalicDirective,
    CdmBulletListDirective,
    CdmOrderedListDirective,
    CdmVideoDirective,
    CdmGoForwardDirective,
    CdmGoBackDirective,
  ],
  exports: [
    CodemeTiptapComponent,
    CdmHeadingDirective,
    CdmParagraphDirective,
    CdmTableDirective,
    CdmCodeDirective,
    CdmLinkDirective,
    CdmBoldDirective,
    CdmItalicDirective,
    CdmBulletListDirective,
    CdmOrderedListDirective,
    CdmVideoDirective,
    CdmGoForwardDirective,
    CdmGoBackDirective,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
})
export class CodemeTiptapModule {}
