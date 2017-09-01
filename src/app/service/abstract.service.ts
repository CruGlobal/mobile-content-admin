import {Headers, RequestOptionsArgs} from '@angular/http';

export abstract class AbstractService {

  protected readonly requestOptions: RequestOptionsArgs = {
    headers: new Headers({'Content-Type': 'application/vnd.api+json'})
  };

  protected handleError(error: any): Promise<any> {
    console.error('An error occurred');
    let message: string;

    try {
      message = error.json().errors[0].detail;
    } catch (e) {
      message = 'An unknown error occurred.';
    }

    return Promise.reject(message);
  }
}
