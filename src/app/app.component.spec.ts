import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';
import { WindowRefService } from './models/window-ref-service';
import { AuthService } from './service/auth/auth.service';

describe('AppComponent', () => {
  const modalServiceStub = ({
    open() {},
  } as unknown) as NgbModal;

  const modalRef = ({
    componentInstance: {
      source: null,
    },
  } as unknown) as NgbModalRef;

  beforeEach(
    waitForAsync(() => {
      spyOn(modalServiceStub, 'open').and.returnValue(modalRef);
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          RouterTestingModule,
          NgbModule,
          HttpClientModule,
          OAuthModule.forRoot(),
          HttpClientTestingModule,
        ],
        providers: [
          { provide: NgbModal, useValue: modalServiceStub },
          WindowRefService,
          AuthService,
        ],
      }).compileComponents();
    }),
  );

  it(
    'should create the app',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }),
  );

  it(
    `should have as title 'Mobile Content Admin'`,
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app.title).toEqual('Mobile Content Admin');
    }),
  );

  it(
    'should render title in a h5 tag',
    waitForAsync(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h5').textContent).toContain(
        'Mobile Content Admin',
      );
    }),
  );
});
