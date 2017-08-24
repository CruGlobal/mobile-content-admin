import {Headers, RequestOptionsArgs} from '@angular/http';
import { environment } from '../environments/environment';

export class Constants {
  public static readonly BASE_URL = environment.base_url;
  public static readonly OPTIONS: RequestOptionsArgs = {
    headers : new Headers({'Content-Type': 'application/vnd.api+json'})
  };
}
