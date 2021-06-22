import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
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

  beforeEach(async(() => {
    spyOn(modalServiceStub, 'open').and.returnValue(modalRef);
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        NgbModule.forRoot(),
        HttpClientModule,
        OAuthModule.forRoot(),
      ],
      providers: [
        { provide: NgbModal, useValue: modalServiceStub },
        { provide: AuthService },
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Mobile Content Admin'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Mobile Content Admin');
  }));

  it('should render title in a h5 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain(
      'Mobile Content Admin',
    );
  }));
});
