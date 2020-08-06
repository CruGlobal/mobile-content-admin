import { Headers, RequestOptionsArgs } from '@angular/http';

export abstract class AbstractService {
  protected readonly requestOptions: RequestOptionsArgs = {
    headers: new Headers({ 'Content-Type': 'application/vnd.api+json' }),
  };

  protected handleError(error: any): Promise<any> {
    let message: string;

    try {
      message = error.json().errors[0].detail;
      console.error('An error occurred:' + message);
    } catch (e) {
      message = 'An unknown error occurred: ' + error;
    }

    return Promise.reject(message);
  }
}
