import {Headers, RequestOptionsArgs} from '@angular/http';

export class Constants {
  public static readonly BASE_URL = 'http://localhost:3000/';
  public static readonly OPTIONS: RequestOptionsArgs = {
    headers : new Headers({'Content-Type': 'application/vnd.api+json'})
  };
}
