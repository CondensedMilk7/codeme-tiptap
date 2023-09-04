import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {
  CdmHeadingDirective,
  CodemeTiptapModule,
  CdmTableDirective,
} from 'codeme-tiptap';
import { ReactiveFormsModule } from '@angular/forms';
import { CdmImageDirective } from './image/cdm-image.directive';

import { EditorService } from 'projects/codeme-tiptap/src/public-api';
import { TableClickDirective } from './table-click/cdm-table-click.directive';
@NgModule({
  declarations: [AppComponent, TableClickDirective],
  imports: [
    BrowserModule,
    CodemeTiptapModule,
    ReactiveFormsModule,
    CdmHeadingDirective,
    CdmTableDirective,
    CdmImageDirective,
  ],
  providers: [EditorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
