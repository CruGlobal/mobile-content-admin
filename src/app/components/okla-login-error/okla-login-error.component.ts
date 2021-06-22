import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'admin-okla-login-error',
  templateUrl: './okla-login-error.component.html',
})
export class OklaLoginErrorComponent implements OnInit {
  @Input() errorMessage: string;

  constructor() {}

  ngOnInit() {}
}
