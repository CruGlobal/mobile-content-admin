import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ResourcesComponent} from './components/resources/resources.component';
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
import {SystemService} from './service/system.service';
import {ResourceTypeService} from './service/resource-type.service';
import {UpdateResourceComponent} from './components/edit-resource/update-resource.component';
import {CreateResourceComponent} from './components/edit-resource/create-resource.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    DashboardComponent,
    TranslationComponent,
    LanguagesComponent,
    AttachmentsComponent,
    FileSelectDirective,
    PageComponent,
    CustomPageComponent,
    UpdateResourceComponent,
    CreateResourceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [
    ResourceService,
    LanguageService,
    DraftService,
    AuthService,
    WindowRefService,
    PageService,
    CustomPageService,
    SystemService,
    ResourceTypeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

