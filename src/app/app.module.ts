import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ResourcesComponent} from './components/resources/resources.component';
import {ResourceDetailComponent} from './components/resource-detail/resource-detail.component';
import {ResourceService} from './service/resource.service';
import {AppComponent} from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AppRoutingModule} from './app-routing.module';

import {HttpModule} from '@angular/http';
import {LanguageService} from './service/language.service';
import {TranslationComponent} from './components/translation/translation.component';
import {DraftService} from './service/draft.service';
import {AuthService} from './service/auth.service';
import {LanguagesComponent} from './components/languages/languages.component';
import {WindowRefService} from './models/window-ref-service';
import {AttachmentsComponent} from './components/attachments/attachments.component';
import {FileSelectDirective} from 'ng2-file-upload';
import {PageService} from './service/page.service';
import {PageComponent} from './components/page/page.component';
import {CustomPageComponent} from './components/custom-page/custom-page.component';
import {CustomPageService} from './service/custom-page.service';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    ResourceDetailComponent,
    DashboardComponent,
    TranslationComponent,
    LanguagesComponent,
    AttachmentsComponent,
    FileSelectDirective,
    PageComponent,
    CustomPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    ResourceService,
    LanguageService,
    DraftService,
    AuthService,
    WindowRefService,
    PageService,
    CustomPageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

