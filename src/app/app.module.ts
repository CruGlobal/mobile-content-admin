import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ResourcesComponent } from './components/resources/resources.component';
import { ResourceService } from './service/resource/resource.service';
import { ResourceLanguageService } from './service/resource-language/resource-language.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpModule } from '@angular/http';
import { LanguageService } from './service/language.service';
import { TranslationComponent } from './components/translation/translation.component';
import { DraftService } from './service/draft.service';
import { AuthService } from './service/auth/auth.service';
import { LanguagesComponent } from './components/languages/languages.component';
import { WindowRefService } from './models/window-ref-service';
import { AttachmentsComponent } from './components/attachments/attachments.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PageService } from './service/page.service';
import { PageComponent } from './components/page/page.component';
import { TipService } from './service/tip.service';
import { TipComponent } from './components/tip/tip.component';
import { CustomManifestComponent } from './components/custom-manifest/custom-manifest.component';
import { CustomPageComponent } from './components/custom-page/custom-page.component';
import { CustomPageService } from './service/custom-page.service';
import { CustomTipComponent } from './components/custom-tip/custom-tip.component';
import { CustomTipService } from './service/custom-tip.service';
import { SystemService } from './service/system.service';
import { ResourceTypeService } from './service/resource-type.service';
import { AttributeTranslationService } from './service/attribute-translation.service';
import { UpdateResourceComponent } from './components/edit-resource/update-resource/update-resource.component';
import { TranslateAttributesComponent } from './components/translate-attributes/translate-attributes.component';
import { CreateResourceComponent } from './components/edit-resource/create-resource/create-resource.component';
import { UpdateResourceLanguageComponent } from './components/edit-resource-language/update-resource-language/update-resource-language.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageComponent } from './components/image/image.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { CreatePageComponent } from './components/create-page/create-page.component';
import { CreateTipComponent } from './components/create-tip/create-tip.component';
import { XmlEditorComponent } from './components/xml-editor/xml-editor.component';
import { AuthGuardService } from './service/auth-guard/auth-guard.service';
import { AttachmentService } from './service/attachment.service';
import { MultipleDraftGeneratorComponent } from './components/multiple-draft-generator/multiple-draft-generator.component';
import { ResourceComponent } from './components/resource/resource.component';
import { CustomManifestService } from './service/custom-manifest.service';
import 'brace/mode/xml';
import { TranslationVersionBadgeComponent } from './components/translation/translation-version-badge/translation-version-badge.component';
import { NgArrayPipesModule } from 'ngx-pipes';
import { OktaLoginComponent } from './components/okta-login/okta-login.component';
import { UserAuthSessionService } from './service/auth/user-auth-session.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { OktaLoginErrorComponent } from './components/okta-login-error/okta-login-error.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { ToolGroupsComponent } from './components/tool-groups/tool-groups.component';
import { ToolGroupService } from './service/tool-group/tool-group.service';
import { CreateToolGroupComponent } from './components/edit-tool-group/create-tool-group/create-tool-group.component';
import { ToolGroupComponent } from './components/tool-group/tool-group.component';
import { LanguageBCP47Service } from './service/languages-bcp47-tag.service';

@NgModule({
  declarations: [
    AppComponent,
    ResourcesComponent,
    ResourceComponent,
    LoginComponent,
    TranslationComponent,
    LanguagesComponent,
    AttachmentsComponent,
    PageComponent,
    TipComponent,
    CustomManifestComponent,
    CustomPageComponent,
    CustomTipComponent,
    UpdateResourceComponent,
    CreateResourceComponent,
    TranslateAttributesComponent,
    UpdateResourceLanguageComponent,
    ImageComponent,
    CreatePageComponent,
    CreateTipComponent,
    XmlEditorComponent,
    MultipleDraftGeneratorComponent,
    TranslationVersionBadgeComponent,
    OktaLoginComponent,
    OktaLoginErrorComponent,
    MyAccountComponent,
    ToolGroupsComponent,
    CreateToolGroupComponent,
    ToolGroupComponent,
  ],
  imports: [
    AceEditorModule,
    BrowserModule,
    FileUploadModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    NgArrayPipesModule,
    NgbModule.forRoot(),
    HttpClientModule,
    OAuthModule.forRoot(),
  ],
  providers: [
    ResourceService,
    LanguageService,
    ResourceLanguageService,
    DraftService,
    AuthService,
    WindowRefService,
    PageService,
    CustomPageService,
    CustomTipService,
    TipService,
    SystemService,
    ResourceTypeService,
    AuthGuardService,
    AttachmentService,
    CustomManifestService,
    UserAuthSessionService,
    AttributeTranslationService,
    ToolGroupService,
    LanguageBCP47Service,
  ],
  entryComponents: [
    UpdateResourceComponent,
    CreateResourceComponent,
    UpdateResourceLanguageComponent,
    TranslateAttributesComponent,
    ImageComponent,
    PageComponent,
    TipComponent,
    CustomManifestComponent,
    CustomPageComponent,
    CreatePageComponent,
    CustomTipComponent,
    CreateTipComponent,
    LoginComponent,
    MultipleDraftGeneratorComponent,
    OktaLoginErrorComponent,
    CreateToolGroupComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
