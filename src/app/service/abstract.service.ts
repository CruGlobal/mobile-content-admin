import {Headers, RequestOptionsArgs} from '@angular/http';

export abstract class AbstractService {

  protected readonly requestOptions: RequestOptionsArgs = {
    headers: new Headers({'Content-Type': 'application/vnd.api+json'})
  };

  protected handleError(error: any): Promise<any> {
    console.error('An error occurred');
    return Promise.reject(error.json().errors);
  }
}
