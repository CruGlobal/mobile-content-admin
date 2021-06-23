import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'admin-okta-login-error',
  templateUrl: './okta-login-error.component.html',
})
export class OktaLoginErrorComponent implements OnInit {
  @Input() errorMessage: string;

  constructor() {}

  ngOnInit() {}
}
