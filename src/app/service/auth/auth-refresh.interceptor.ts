import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/**
 * The API slides the short-lived session forward by returning a freshly
 * minted token in the Authorization response header on every request. Capture
 * it and replace the stored token so an active user remains signed in.
 */
@Injectable()
export class AuthRefreshInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (
          req.url.startsWith(environment.base_url) &&
          event instanceof HttpResponse
        ) {
          const refreshed = event.headers.get('Authorization');
          // Skip when there is no stored token: the user has logged out and an
          // in-flight response must not resurrect the cleared session.
          if (refreshed && this.authService.authToken) {
            this.authService.setAuthToken(refreshed);
          }
        }
      }),
    );
  }
}
