import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AceEditorModule } from 'ng2-ace-editor';
import { FileUploadModule } from 'ng2-file-upload';
import { NgArrayPipesModule } from 'ngx-pipes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AttachmentsComponent } from './components/attachments/attachments.component';
import { CreatePageComponent } from './components/create-page/create-page.component';
import { CreateTipComponent } from './components/create-tip/create-tip.component';
import { CustomManifestComponent } from './components/custom-manifest/custom-manifest.component';
import { CustomPageComponent } from './components/custom-page/custom-page.component';
import { CustomTipComponent } from './components/custom-tip/custom-tip.component';
import { CreateResourceComponent } from './components/edit-resource/create-resource/create-resource.component';
import { UpdateResourceComponent } from './components/edit-resource/update-resource/update-resource.component';
import { UpdateResourceLanguageComponent } from './components/edit-resource-language/update-resource-language/update-resource-language.component';
import { CreateToolGroupComponent } from './components/edit-tool-group/create-tool-group/create-tool-group.component';
import { UpdateToolGroupComponent } from './components/edit-tool-group/update-tool-group/update-tool-group.component';
import { ToolGroupResourceComponent } from './components/edit-tool-group-resource/tool-group-resource.component';
import { ToolGroupRuleComponent } from './components/edit-tool-group-rule/tool-group-rule.component';
import { ToolGroupRuleReuseableComponent } from './components/edit-tool-group-rule-reuseable/tool-group-rule-reuseable.component';
import { ToolGroupToolReuseableComponent } from './components/edit-tool-group-tool-reuseable/tool-group-tool-reuseable.component';
import { ImageComponent } from './components/image/image.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { LoginComponent } from './components/login/login.component';
import { MultipleDraftGeneratorComponent } from './components/multiple-draft-generator/multiple-draft-generator.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { OktaLoginComponent } from './components/okta-login/okta-login.component';
import { OktaLoginErrorComponent } from './components/okta-login-error/okta-login-error.component';
import { PageComponent } from './components/page/page.component';
import { ResourceComponent } from './components/resource/resource.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { TipComponent } from './components/tip/tip.component';
import { ToolGroupComponent } from './components/tool-group/tool-group.component';
import { ToolGroupsComponent } from './components/tool-groups/tool-groups.component';
import { TranslateAttributesComponent } from './components/translate-attributes/translate-attributes.component';
import { TranslationVersionBadgeComponent } from './components/translation/translation-version-badge/translation-version-badge.component';
import { TranslationComponent } from './components/translation/translation.component';
import { XmlEditorComponent } from './components/xml-editor/xml-editor.component';
import { WindowRefService } from './models/window-ref-service';
import { AttachmentService } from './service/attachment.service';
import { AttributeTranslationService } from './service/attribute-translation.service';
import { AuthService } from './service/auth/auth.service';
import { UserAuthSessionService } from './service/auth/user-auth-session.service';
import { AuthGuardService } from './service/auth-guard/auth-guard.service';
import { CustomManifestService } from './service/custom-manifest.service';
import { CustomPageService } from './service/custom-page.service';
import { CustomTipService } from './service/custom-tip.service';
import { DraftService } from './service/draft.service';
import { LanguageService } from './service/language.service';
import { PageService } from './service/page.service';
import { ResourceService } from './service/resource/resource.service';
import { ResourceLanguageService } from './service/resource-language/resource-language.service';
import { ResourceTypeService } from './service/resource-type.service';
import { SystemService } from './service/system.service';
import { TipService } from './service/tip.service';
import 'brace/mode/xml';
import { ToolGroupService } from './service/tool-group/tool-group.service';

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
    UpdateToolGroupComponent,
    ToolGroupRuleComponent,
    ToolGroupRuleReuseableComponent,
    ToolGroupResourceComponent,
    ToolGroupToolReuseableComponent,
  ],
  imports: [
    AceEditorModule,
    BrowserModule,
    FileUploadModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgArrayPipesModule,
    NgbModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
