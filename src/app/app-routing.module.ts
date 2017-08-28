import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResourcesComponent } from './components/resources/resources.component';
import {LanguagesComponent} from './components/languages/languages.component';
import {AttachmentsComponent} from './components/attachments/attachments.component';
import {AuthGuardService} from './service/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'resources', component: ResourcesComponent, canActivate: [AuthGuardService] },
  { path: 'languages', component: LanguagesComponent, canActivate: [AuthGuardService] },
  { path: 'attachments',     component: AttachmentsComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
