import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CdmHeadingDirective, CodemeTiptapModule } from 'codeme-tiptap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CodemeTiptapModule,
    ReactiveFormsModule,
    CdmHeadingDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
