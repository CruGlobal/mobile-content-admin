import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ResourcesComponent} from './components/resources/resources.component';
import {ResourceService} from './service/resource/resource.service';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {AppRoutingModule} from './app-routing.module';

import {HttpModule} from '@angular/http';
import {LanguageService} from './service/language.service';
import {TranslationComponent} from './components/translation/translation.component';
import {DraftService} from './service/draft.service';
import {AuthService} from './service/auth/auth.service';
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
import {UpdateResourceComponent} from './components/edit-resource/update-resource/update-resource.component';
import {CreateResourceComponent} from './components/edit-resource/create-resource/create-resource.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ImageComponent} from './components/image/image.component';
import {AceEditorDirective} from 'ng2-ace-editor';
import {CreatePageComponent} from './components/create-page/create-page.component';
import {XmlEditorComponent} from './components/xml-editor/xml-editor.component';
import {AuthGuardService} from './service/auth-guard/auth-guard.service';
import {AttachmentService} from './service/attachment.service';
import {MultipleDraftGeneratorComponent} from './components/multiple-draft-generator/multiple-draft-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    LoginComponent,
    TranslationComponent,
    LanguagesComponent,
    AttachmentsComponent,
    FileSelectDirective,
    PageComponent,
    CustomPageComponent,
    UpdateResourceComponent,
    CreateResourceComponent,
    ImageComponent,
    AceEditorDirective,
    CreatePageComponent,
    XmlEditorComponent,
    MultipleDraftGeneratorComponent
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
    ResourceTypeService,
    AuthGuardService,
    AttachmentService
  ],
  entryComponents: [
    UpdateResourceComponent,
    CreateResourceComponent,
    ImageComponent,
    PageComponent,
    CustomPageComponent,
    CreatePageComponent,
    LoginComponent,
    MultipleDraftGeneratorComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

