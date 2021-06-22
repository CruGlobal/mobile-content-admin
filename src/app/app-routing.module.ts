import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './components/resources/resources.component';
import { LanguagesComponent } from './components/languages/languages.component';
import { AttachmentsComponent } from './components/attachments/attachments.component';
import { AuthGuardService } from './service/auth-guard/auth-guard.service';
import { OklaLoginComponent } from './components/okla-login/okla-login.component';

const routes: Routes = [
  { path: '', redirectTo: '/translations', pathMatch: 'full' },
  {
    path: 'translations',
    component: ResourcesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'languages',
    component: LanguagesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'attachments',
    component: AttachmentsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login/callback',
    component: OklaLoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
