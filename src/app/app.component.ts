import { Component } from '@angular/core';

@Component({
  selector: 'admin-app',
  template: `
   <h1>{{title}}</h1>
   <nav>
     <a routerLink="/dashboard">Dashboard</a>
     <a routerLink="/resources">Resources</a>
     <a routerLink="/attachments">Attachments</a>
     <a routerLink="/languages">Languages</a>
   </nav>
   <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Mobile Content Admin';
}
